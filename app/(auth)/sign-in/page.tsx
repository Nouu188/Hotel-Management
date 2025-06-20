"use client";

import AuthForm from '@/components/form/AuthForm'
import { SignInSchema } from '@/lib/validation'
import React from 'react'

const SignIn = () => {
  return (
    <AuthForm
      schema={SignInSchema}
      defaultValues={{ email: "", password: ""}}
      formType='SIGN_IN'
    />
  )
}

export default SignIn