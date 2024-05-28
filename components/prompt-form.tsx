'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import axios from 'axios'

import { useActions, useUIState } from 'ai/rsc'

import { UserMessage } from './stocks/message'
import { type AI } from '@/lib/chat/actions'
import { Button } from '@/components/ui/button'
import { IconArrowElbow, IconPlus, IconPaperclip } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'

export function PromptForm({
  input,
  setInput
}: {
  input: string
  setInput: (value: string) => void
}) {
  const router = useRouter()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState<typeof AI>()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [showTooltip, setShowTooltip] = React.useState(true);
  const [selectedFile, setSelectedFile] = React.useState<File>()

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])
  
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    //try {
      if (!file) return
      const formData = new FormData() //create form data
      formData.append("file", file) //use it to update
      //const { data } = await axios.post("/api/app/file", formData) //make call using axios - endpoint
      //for vector upload
   
    // Pass the file path to the vector API
    //Did not work
    //   const response = await axios.post('/api/app/vector', {
    //     filePath: data.filePath,
    // })
      //console.log(response, data.filePath)

  }
  
  //if ref is on current input- and button clicked - triggers input call to func above
  const handlePaperClipClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  //description mouse hover for added upload button
  const handleMouseEnter = () => {
    setShowTooltip(true); // Show the tooltip on mouse enter
  };

  const handleMouseLeave = () => {
    setShowTooltip(false); // Hide the tooltip on mouse leave
  }

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }

        const value = input.trim()
        setInput('')
        if (!value) return

        // Optimistically add user message UI
        setMessages(currentMessages => [
          ...currentMessages,
          {
            id: nanoid(),
            display: <UserMessage>{value}</UserMessage>
          }
        ])

        // Submit and get response message
        const responseMessage = await submitUserMessage(value)
        setMessages(currentMessages => [...currentMessages, responseMessage])
      }}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-[14px] size-8 rounded-full bg-background p-0 sm:left-4"
              onClick={() => {
                router.push('/new')
              }}
            >
              <IconPlus />
              <span className="sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className='absolute left-10 top-[14px] size-8 rounded-full bg-background p-0 sm:left-14'
              onClick={handlePaperClipClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}

            >
              <IconPaperclip />
              <span className='sr-only'>Upload file</span>
            </Button>
          </TooltipTrigger>
          {showTooltip && <TooltipContent>Upload file</TooltipContent>}
        </Tooltip>
        {/*hidden file inpus*/}
        <input
          type="file"
          ref={fileInputRef} //refreences the file input element
          className="hidden"
          onChange={handleFileUpload}
        />

        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-full resize-none bg-transparent pl-12 pr-20 py-[1.3rem] focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="absolute right-0 top-[13px] sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" size="icon" disabled={input === ''}>
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}




// const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//   const file = event.target.files?.[0]
//   setShowTooltip(false)
//   if (file) {
//     console.log("File selected: ", file);

//     // Create form data for file
//     const formData = new FormData()
//     formData.append('file', file)

//     try {
//       const response = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData,
//       })

//       if (response.ok) {
//         const data = await response.json();
//         console.log('File uploaded successfully:', data);
//       } else {
//         console.error('File upload failed')
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error)
//     }
//   }
// }