'use client'

import AuthSync from '../../components/AuthSync'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AuthSync />
      {children}
    </>
  )
}
