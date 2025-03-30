import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import { AuthForm } from './auth-form';

type AuthModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AuthModal = ({ isOpen, onOpenChange }: AuthModalProps) => {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {mode === 'signIn' ? 'ログイン' : '新規登録'}
            </ModalHeader>
            <ModalBody>
              <AuthForm
                mode={mode}
                onSuccess={() => onClose()}
                onCancel={() => onClose()}
              />
            </ModalBody>
            <ModalFooter className="flex justify-center">
              <Button
                color="primary"
                variant="light"
                onPress={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
              >
                {mode === 'signIn'
                  ? 'アカウントを作成する'
                  : 'すでにアカウントをお持ちの方'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
