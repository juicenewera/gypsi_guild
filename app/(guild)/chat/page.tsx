'use client'

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-4xl font-bold text-text-primary">Chat</h1>
        <p className="text-text-secondary">Em breve</p>
        <p className="text-text-muted text-sm max-w-md mx-auto">
          O chat da guilda está em desenvolvimento. Conecte-se com outros membros em breve!
        </p>
      </div>
    </div>
  )
}
