import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useState } from 'react';
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
              {mode === 'signIn' ? 'Sign In' : 'Sign Up'}
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
                variant="ghost"
                onPress={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
              >
                {mode === 'signIn'
                  ? 'Create Account'
                  : 'Already have an account?'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
