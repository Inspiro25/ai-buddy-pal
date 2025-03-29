
import { useState, useRef, useEffect } from 'react';
import { Send, File as FileIcon, Image, Mic, X, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SpeechRecognition extends EventTarget {
  start(): void;
  stop(): void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
  };
  var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
  };
}

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
  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsRecordingSupported(false);
    }
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition is not supported in this browser');
    }
  }, []);

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
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
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
    e.target.value = '';
    toast.success(`${type} added`);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
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
        const fileName = `recording-${Date.now()}.wav`;
        
        // Fixed: Create File object correctly with an array of parts as first arg
        const audioFile = new File([audioBlob], fileName, { type: 'audio/wav' });
        
        const audioURL = URL.createObjectURL(audioBlob);
        
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

      mediaRecorder.start();
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
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

  const startSpeechRecognition = () => {
    try {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        toast.error('Speech recognition is not supported in this browser');
        return;
      }

      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        setMessage(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        toast.error(`Speech recognition error: ${event.error}`);
        stopSpeechRecognition();
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
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

  return (
    <div className="flex flex-col w-full">
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
          placeholder={isRecording ? `Recording... ${formatTime(recordingTime)}` : isListening ? "Listening..." : "Type your message..."}
          disabled={isLoading || isRecording || isListening}
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
        ) : isListening ? (
          <Button 
            type="button" 
            size="icon" 
            onClick={stopSpeechRecognition}
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
          disabled={isRecording || isListening}
        >
          <File className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => imageInputRef.current?.click()}
          className="rounded-full p-2 bg-gray-800/50"
          disabled={isRecording || isListening}
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
            disabled={isListening}
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
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={isListening ? stopSpeechRecognition : startSpeechRecognition}
          className={cn(
            "rounded-full p-2",
            isListening ? "bg-red-500/50 animate-pulse" : "bg-gray-800/50"
          )}
          disabled={isRecording}
        >
          <Mic className="h-4 w-4" />
          {isListening && <span className="ml-1 text-xs">Stop</span>}
        </Button>
      </div>
    </div>
  );
}
