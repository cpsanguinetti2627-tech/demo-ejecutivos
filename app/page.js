'use client';

import { useState } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import ConnectingScreen from '@/components/ConnectingScreen';
import PickExecutiveScreen from '@/components/PickExecutiveScreen';
import ChatScreen from '@/components/ChatScreen';
import { getExecutive } from '@/lib/executives';

const STEPS = {
  WELCOME: 'welcome',
  CONNECTING: 'connecting',
  PICK: 'pick',
  CHAT: 'chat',
};

export default function Home() {
  const [step, setStep] = useState(STEPS.WELCOME);
  const [executiveId, setExecutiveId] = useState(null);

  const executive = executiveId ? getExecutive(executiveId) : null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-ink sm:py-8">
      <div className="w-full sm:max-w-[400px] h-[100dvh] sm:h-[820px] bg-mist sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden relative">
        {step === STEPS.WELCOME && (
          <WelcomeScreen onStart={() => setStep(STEPS.CONNECTING)} />
        )}
        {step === STEPS.CONNECTING && (
          <ConnectingScreen onDone={() => setStep(STEPS.PICK)} />
        )}
        {step === STEPS.PICK && (
          <PickExecutiveScreen
            onPick={(id) => {
              setExecutiveId(id);
              setStep(STEPS.CHAT);
            }}
          />
        )}
        {step === STEPS.CHAT && executive && (
          <ChatScreen
            executive={executive}
            onBack={() => {
              setStep(STEPS.PICK);
              setExecutiveId(null);
            }}
          />
        )}
      </div>
    </main>
  );
}
