import { useState, useRef, useEffect } from 'react';
import { Send, File, Image, Mic, X, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MessageInputProps {
  onSend: (message: string, attachments?: Array<{
    type: 'image' | 'document' | 'audio';
    file: File;
    preview?: string;
  }>) => void;
  isLoading?: boolean;
  compact?: boolean;
}

export function MessageInput({ onSend, isLoading = false, compact = false }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Array<{
    type: 'image' | 'document' | 'audio';
    file: File;
    preview?: string;
  }>>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isRecordingSupported, setIsRecordingSupported] = useState(true);

  // Check for recording support on component mount
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsRecordingSupported(false);
    }
  }, []);

  // Clean up recording resources when component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        try {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        } catch (error) {
          console.error('Error stopping media tracks:', error);
        }
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || attachments.length > 0) {
      onSend(message, attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document' | 'audio') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const newAttachment = { type, file } as any;

    // Create preview for images
    if (type === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAttachments(prev => prev.map(att => 
          att.file === file ? { ...att, preview: e.target?.result as string } : att
        ));
      };
      reader.readAsDataURL(file);
      newAttachment.preview = 'loading';
    }

    setAttachments(prev => [...prev, newAttachment]);
    e.target.value = ''; // Reset input
    toast.success(`${type} added`);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    // Check if browser supports audio recording
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error('Audio recording is not supported in this browser');
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setRecordingTime(0);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (audioChunksRef.current.length === 0) {
          toast.error('No audio recorded');
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
        
        // Create audio element for preview
        const audioURL = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioURL);
        
        setAttachments(prev => [...prev, { 
          type: 'audio', 
          file: audioFile,
          preview: audioURL
        }]);
        
        toast.success('Audio recording added');
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };

      // Start recording and timer
      mediaRecorder.start();
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Auto-stop after 60 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
        }
      }, 60000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
        // Stop all audio tracks
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
      setIsRecording(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col w-full">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 border-t border-gray-800">
          {attachments.map((attachment, index) => (
            <div key={index} className="relative group">
              {attachment.type === 'image' && attachment.preview ? (
                <div className="w-16 h-16 rounded overflow-hidden">
                  <img src={attachment.preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : attachment.type === 'audio' && attachment.preview ? (
                <div className="w-16 h-16 bg-gray-800 rounded flex flex-col items-center justify-center">
                  <Mic className="h-6 w-6 text-purple-400" />
                  <audio controls className="w-14 h-4 mt-1" src={attachment.preview}></audio>
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center">
                  {attachment.type === 'document' && <File className="h-6 w-6 text-gray-400" />}
                  {attachment.type === 'audio' && <Mic className="h-6 w-6 text-gray-400" />}
                </div>
              )}
              <button 
                onClick={() => removeAttachment(index)}
                className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Message input and controls */}
      <form 
        onSubmit={handleSubmit}
        className={cn(
          "flex gap-2 w-full",
          compact ? "p-2" : "p-3 md:p-4"
        )}
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={cn(
            "flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white",
            compact ? "py-1.5 text-sm" : "py-2 h-10"
          )}
          placeholder={isRecording ? `Recording... ${formatTime(recordingTime)}` : "Type your message..."}
          disabled={isLoading || isRecording}
          autoComplete="off"
        />
        
        {isRecording ? (
          <Button 
            type="button" 
            size="icon" 
            onClick={stopRecording}
            className="bg-red-600 hover:bg-red-700 h-10 w-10 flex items-center justify-center animate-pulse"
          >
            <StopCircle className="h-5 w-5" />
          </Button>
        ) : (
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || (!message.trim() && attachments.length === 0)}
            className={cn(
              "bg-purple-600 hover:bg-purple-700 flex items-center justify-center",
              compact ? "h-8 w-8" : "h-10 w-10"
            )}
          >
            <Send className={compact ? "h-4 w-4" : "h-5 w-5"} />
          </Button>
        )}
      </form>

      {/* Attachment buttons */}
      <div className="flex justify-center gap-4 pb-2">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={(e) => handleFileChange(e, 'document')} 
          className="hidden" 
          accept=".pdf,.doc,.docx,.txt"
        />
        <input 
          type="file" 
          ref={imageInputRef} 
          onChange={(e) => handleFileChange(e, 'image')} 
          className="hidden" 
          accept="image/*"
        />
        <input 
          type="file" 
          ref={audioInputRef} 
          onChange={(e) => handleFileChange(e, 'audio')} 
          className="hidden" 
          accept="audio/*"
        />

        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full p-2 bg-gray-800/50"
          disabled={isRecording}
        >
          <File className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => imageInputRef.current?.click()}
          className="rounded-full p-2 bg-gray-800/50"
          disabled={isRecording}
        >
          <Image className="h-4 w-4" />
        </Button>
        
        {isRecordingSupported ? (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={isRecording ? stopRecording : startRecording}
            className={cn(
              "rounded-full p-2",
              isRecording ? "bg-red-500/50 animate-pulse" : "bg-gray-800/50"
            )}
          >
            <Mic className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="rounded-full p-2 bg-gray-800/50 opacity-50 cursor-not-allowed"
            title="Audio recording not supported in this browser"
            disabled
          >
            <Mic className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  // Add speech recognition state and refs
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Check for speech recognition support on component mount
  useEffect(() => {
    // Check if the browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition is not supported in this browser');
    }
  }, []);

  // Add speech recognition functions
  const startSpeechRecognition = () => {
    try {
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast.error('Speech recognition is not supported in this browser');
        return;
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      // Configure recognition
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      // Handle results
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        setMessage(transcript);
      };
      
      // Handle errors
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        toast.error(`Speech recognition error: ${event.error}`);
        stopSpeechRecognition();
      };
      
      // Handle end of recognition
      recognition.onend = () => {
        setIsListening(false);
      };
      
      // Start listening
      recognition.start();
      setIsListening(true);
      toast.success('Listening...');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast.error('Failed to start speech recognition');
    }
  };
  
  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Modify your UI to include speech recognition button
  return (
    <div className={cn("relative", compact ? "px-2 py-2" : "px-4 py-4")}>
      {/* ... existing attachment display code ... */}
      
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* ... existing attachment buttons ... */}
        
        {/* Add speech recognition button */}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={isListening ? stopSpeechRecognition : startSpeechRecognition}
          className={cn(
            "text-muted-foreground hover:text-primary transition-colors",
            isListening && "text-red-500 hover:text-red-600"
          )}
          disabled={isLoading}
        >
          {isListening ? (
            <StopCircle className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
        
        {/* ... existing input field and send button ... */}
      </form>
      
      {/* ... existing file input refs ... */}
    </div>
  );
}