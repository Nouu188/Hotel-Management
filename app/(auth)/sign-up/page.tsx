"use client";

import AuthForm from '@/components/form/AuthForm'
import { signUpWithCredentials } from '@/lib/actions/auth.action'
import { SignUpSchema } from '@/lib/validation'
import React from 'react'

const SignUp = () => {
  return (
    <div>
      <AuthForm
        schema={SignUpSchema}
        defaultValues={{ email: "", name: "", phone: "", password: ""}}
        onSubmitSignUp={signUpWithCredentials}
        formType='SIGN_UP'
      />
    </div>
  )
}

export default SignUp