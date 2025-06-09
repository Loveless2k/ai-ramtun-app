'use client'

import AuthSync from '../../components/AuthSync'
import RoleProtection from '../../components/RoleProtection'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AuthSync />
      <RoleProtection allowedRoles={['student']}>
        {children}
      </RoleProtection>
    </>
  )
}
