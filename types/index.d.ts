import * as React from 'react'

export type DataTypes = 'TEXT' | 'IMAGE'

export type UploadStatus = 'uploading' | 'done'

export interface TextRow {
  _id?: string
  type: DataTypes
  raw: string
}

export interface ImageRow {
  _id?: string
  size?: number
  status?: UploadStatus
  type: DataTypes
  url: string
  name: string
  width: number
  height: number
}

export interface ImageFile extends File {
  _id: string
}

export interface EditProps {
  value?: Array<TextRow | ImageRow>
  placeholder?: string
  uploadImages?: (files: ImageFile[], callback: (filesResult: ImageRow[]) => {}) => void
  onChange?: (newValue: Array<TextRow | ImageRow>) => void
}

declare class ReactTextMediaEditor extends React.Component<EditProps> {}

export default ReactInteractionProvider
