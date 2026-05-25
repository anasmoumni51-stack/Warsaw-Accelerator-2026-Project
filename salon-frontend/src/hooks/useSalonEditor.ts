import { useState } from 'react'
import { toast } from 'react-toastify'
import type { SalonDetail } from '../types'

export function useSalonEditor(salon: SalonDetail | null, onUpdateSalon: (salon: SalonDetail) => Promise<void>) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedSalon, setEditedSalon] = useState<SalonDetail | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const displaySalon = editedSalon || salon

  const handleEdit = () => {
    if (salon) {
      setEditedSalon({ ...salon })
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    if (!editedSalon?.name.trim()) {
      toast.error("Salon name can't be empty!")
      return
    }
    if (!editedSalon?.address.trim()) {
      toast.error("Address can't be empty!")
      return
    }

    setIsSaving(true)
    try {
      await onUpdateSalon(editedSalon)
      setIsEditing(false)
      setEditedSalon(null)
    } catch {
      // Error toast is handled in onUpdateSalon
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedSalon(null)
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof SalonDetail, value: string | number | null) => {
    setEditedSalon(prev => prev ? { ...prev, [field]: value } : null)
  }

  const handleServicesChange = (service: string, checked: boolean) => {
    setEditedSalon(prev => {
      if (!prev) return null
      return {
        ...prev,
        services: checked
          ? [...prev.services, service]
          : prev.services.filter(s => s !== service),
      }
    })
  }

  return {
    isEditing,
    isSaving,
    displaySalon,
    editedSalon,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
    handleServicesChange,
  }
}
