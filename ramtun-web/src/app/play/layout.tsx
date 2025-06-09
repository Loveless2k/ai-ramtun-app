'use client'

import AuthSync from '../../components/AuthSync'
import RoleProtection from '../../components/RoleProtection'

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AuthSync />
      <RoleProtection allowedRoles={['student', 'teacher']}>
        {children}
      </RoleProtection>
    </>
  )
}
