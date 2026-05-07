import { useState } from "react"
import { Plus, GripVertical, Trash2 } from "lucide-react"
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { CmsArtworkImage } from "@/lib/cms-types"

export function InnerGalleryManager({ 
  images, 
  onChange 
}: { 
  images: CmsArtworkImage[]
  onChange: (images: CmsArtworkImage[]) => void 
}) {
  const [isUploading, setIsUploading] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex(img => img.id === active.id)
      const newIndex = images.findIndex(img => img.id === over.id)
      
      const newArray = arrayMove(images, oldIndex, newIndex)
      onChange(newArray.map((img, index) => ({ ...img, order: index })))
    }
  }

  const uploadImages = async (files: FileList | null) => {
    if (!files?.length) return
    setIsUploading(true)
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const form = new FormData()
        form.append("file", file)
        form.append("folder", "artworks/gallery")
        const response = await fetch("/api/upload", { method: "POST", body: form })
        if (!response.ok) throw new Error("Upload failed")
        return response.json()
      })
      
      const uploaded = await Promise.all(uploadPromises)
      
      const newImages: CmsArtworkImage[] = uploaded.map((item, index) => ({
        id: `new-${Date.now()}-${index}`,
        url: item.url,
        altText: "",
        caption: "",
        order: images.length + index,
      }))
      
      onChange([...images, ...newImages])
    } catch (error) {
      console.error(error)
      alert("Failed to upload some images.")
    } finally {
      setIsUploading(false)
    }
  }

  const updateCaption = (id: string, caption: string) => {
    onChange(images.map(img => img.id === id ? { ...img, caption } : img))
  }

  const deleteImage = (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      onChange(images.filter(img => img.id !== id))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-2xl">Inner Gallery ({images.length})</h3>
        <label className="cinematic-button inline-flex cursor-pointer items-center gap-2 px-4 py-3 text-[10px] uppercase tracking-[0.22em] bg-stone-900 text-white disabled:opacity-50">
          <Plus className="size-4" />
          {isUploading ? "Uploading..." : "Add Images"}
          <input 
            hidden 
            type="file" 
            accept="image/png,image/jpeg,image/webp" 
            multiple 
            onChange={(e) => void uploadImages(e.target.files)} 
            disabled={isUploading}
          />
        </label>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={images.map(img => img.id)} 
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <SortableImageCard
                key={image.id}
                image={image}
                index={index}
                onCaptionChange={(caption) => updateCaption(image.id, caption)}
                onDelete={() => deleteImage(image.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      {images.length === 0 && (
        <div className="border border-dashed border-stone-300 p-12 text-center text-sm text-stone-500">
          No inner gallery images yet.
        </div>
      )}
    </div>
  )
}

function SortableImageCard({ 
  image, 
  index, 
  onCaptionChange, 
  onDelete 
}: { 
  image: CmsArtworkImage
  index: number
  onCaptionChange: (c: string) => void
  onDelete: () => void 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-stone-200 overflow-hidden shadow-sm flex flex-col relative group">
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing bg-black/50 p-1.5 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div className="relative aspect-square">
        <img 
          src={image.url} 
          alt={image.altText || `Gallery image ${index + 1}`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <button 
            type="button" 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete()
            }}
            className="pointer-events-auto bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {index + 1}
        </div>
      </div>
      
      <div className="p-2 border-t border-stone-100">
        <textarea
          placeholder="Caption (optional)..."
          value={image.caption || ""}
          onChange={(e) => onCaptionChange(e.target.value)}
          className="w-full text-xs min-h-[60px] p-2 border border-transparent hover:border-stone-200 focus:border-stone-400 focus:outline-none resize-y bg-stone-50"
        />
      </div>
    </div>
  )
}
