import React, { useContext } from 'react'

const EditotContext = React.createContext()
export default EditotContext

export function useEditor() {
  const context = useContext(EditotContext)
  return context
}
