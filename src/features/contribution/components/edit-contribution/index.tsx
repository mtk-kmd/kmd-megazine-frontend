'use client'

import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { ChevronLeft, FileText, Upload, X } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import {
  addContributionSchema,
  AddContributionValues,
} from '@/features/contribution/utils/validator'
import { useSession } from 'next-auth/react'
import { Separator } from '@/components/ui/separator'
import {
  useGetContribution,
  useUpdateContribution,
} from '../../api/contribution'
import { PulseLoader } from 'react-spinners'
import { ErrorWidget } from '@/components/ui/error-widget'

const EditConntribution = () => {
  const router = useRouter()
  const session = useSession()
  const accessToken = session?.data?.user.token as string

  const { contributionId } = useParams<{ contributionId: string }>()

  const {
    mutate: updateContributionMutate,
    isPending: isUpdateContributionPending,
  } = useUpdateContribution(accessToken)

  const {
    data: contribution,
    isPending,
    error,
    isSuccess,
  } = useGetContribution(accessToken, Number(contributionId), !!accessToken)

  const [imageFiles, setImageFiles] = React.useState<File[]>([])
  const [articleFile, setArticleFile] = React.useState<File | null>(null)

  const updateContributionForm = useForm<AddContributionValues>({
    resolver: zodResolver(addContributionSchema),
    defaultValues: {
      event_id: 0,
      user_id: 0,
      title: '',
      content: '',
      images: null,
      articleFile: null,
      agreed_to_terms: false,
    },
  })

  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
  } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png'],
    },
    disabled: isUpdateContributionPending,
    onDrop: (acceptedFiles) => {
      setImageFiles((prev) => [...prev, ...acceptedFiles])
      updateContributionForm.setValue(
        'images',
        [...imageFiles, ...acceptedFiles],
        {
          shouldValidate: true,
        }
      )
      updateContributionForm.clearErrors('articleFile')
    },
  })

  const {
    getRootProps: getArticleRootProps,
    getInputProps: getArticleInputProps,
    isDragActive: isArticleDragActive,
  } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
    },
    disabled: isUpdateContributionPending,
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setArticleFile(acceptedFiles[0])
        updateContributionForm.setValue('articleFile', acceptedFiles[0], {
          shouldValidate: true,
        })
        updateContributionForm.clearErrors('images')
      }
    },
  })

  const removeImage = (index: number) => {
    setImageFiles((prev) => {
      const newFiles = [...prev]
      newFiles.splice(index, 1)
      updateContributionForm.setValue('images', newFiles, {
        shouldValidate: true,
      })
      if (newFiles.length === 0) {
        updateContributionForm.trigger('articleFile')
      }
      return newFiles
    })
  }

  const removeArticle = () => {
    setArticleFile(null)
    updateContributionForm.setValue('articleFile', undefined, {
      shouldValidate: true,
    })
    updateContributionForm.trigger('images')
  }

  const onSubmit = async (data: AddContributionValues) => {
    updateContributionMutate(
      { ...data, submission_id: Number(contributionId) },
      {
        onSuccess: () => {
          updateContributionForm.reset()
          updateContributionForm.clearErrors()
          setImageFiles([])
          setArticleFile(null)
          router.push(`/contributions/${contributionId}`)
        },
      }
    )
  }

  useEffect(() => {
    if (isSuccess && contribution) {
      updateContributionForm.setValue('title', contribution.result.title)
      updateContributionForm.setValue('content', contribution.result.content)
      updateContributionForm.setValue(
        'agreed_to_terms',
        contribution.result.agreed_to_terms
      )
      updateContributionForm.setValue('event_id', contribution.result.event_id)
      updateContributionForm.setValue(
        'user_id',
        contribution.result.event.User.user_id
      )
    }
  }, [contribution, isSuccess])

  if (isPending) {
    return (
      <div className="container mx-auto flex flex-col gap-y-5 p-0 sm:px-6 sm:py-5 lg:px-8">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <PulseLoader color="#3b82f6" size={12} margin={4} />
            <p className="mt-4 text-base font-medium text-muted-foreground">
              Loading contribution details...
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              This may take a few moments
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto flex flex-col gap-y-5 p-0 sm:px-6 sm:py-5 lg:px-8">
        <ErrorWidget
          type="error"
          title={error.name}
          description={error.message}
          className="flex min-h-[50vh] items-center justify-center"
        />
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto flex flex-col gap-y-5 p-0 sm:px-6 sm:py-5 lg:px-8">
        <Button
          variant="secondary"
          className="w-fit"
          onClick={() => router.back()}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-6 space-y-1">
          <h2 className="text-2xl font-semibold text-primary">
            Submit Contribution
          </h2>
          <p className="text-sm text-muted-foreground">
            Share your article or images for the event.
          </p>
        </div>

        <Form {...updateContributionForm}>
          <form
            onSubmit={updateContributionForm.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr,2fr]">
              <FormField
                control={updateContributionForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-full grid md:col-span-2 md:grid-cols-subgrid">
                    <FormLabel className="md:col-span-1">Title</FormLabel>
                    <div className="md:col-span-1">
                      <FormControl>
                        <Input
                          placeholder="Enter title"
                          className="h-10 w-full"
                          {...field}
                          disabled={isUpdateContributionPending}
                        />
                      </FormControl>
                      <FormMessage className="mt-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[1fr,2fr]">
              <FormField
                control={updateContributionForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="col-span-full grid md:col-span-2 md:grid-cols-subgrid">
                    <FormLabel className="md:col-span-1">Content</FormLabel>
                    <div className="md:col-span-1">
                      <FormControl>
                        <div className="overflow-hidden rounded-md border border-input focus-within:ring-1 focus-within:ring-ring">
                          <Textarea
                            placeholder="Enter your content here..."
                            className="min-h-40 w-full resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                            disabled={isUpdateContributionPending}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="mt-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[1fr,2fr]">
              <FormField
                control={updateContributionForm.control}
                name="images"
                render={({ field }) => (
                  <FormItem className="col-span-full grid md:col-span-2 md:grid-cols-subgrid">
                    <FormLabel className="md:col-span-1">Images</FormLabel>
                    <div className="md:col-span-1">
                      <FormControl>
                        <div
                          {...getImageRootProps()}
                          className={cn(
                            'cursor-pointer rounded-lg border-2 border-dashed border-input p-4 text-center',
                            isImageDragActive && 'border-primary'
                          )}
                        >
                          <input {...getImageInputProps()} />
                          <Upload
                            strokeWidth={2}
                            className="mx-auto size-6 text-primary"
                          />
                          <p className="mt-2 text-sm">
                            Drop images or click to upload
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            JPG, JPEG, PNG (max 5MB)
                          </p>
                        </div>
                      </FormControl>
                      {imageFiles.length > 0 && (
                        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                          {imageFiles.map((file, index) => (
                            <div
                              key={index}
                              className="group relative aspect-square overflow-hidden rounded-lg border border-input"
                            >
                              <Image
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="object-cover"
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                disabled={isUpdateContributionPending}
                                className="absolute right-1 top-1 h-7 w-7"
                                onClick={() => removeImage(index)}
                              >
                                <X className="size-4" strokeWidth={2.5} />
                                <span className="sr-only">Remove image</span>
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      <FormMessage className="mt-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[1fr,2fr]">
              <FormField
                control={updateContributionForm.control}
                name="articleFile"
                render={({ field }) => (
                  <FormItem className="col-span-full grid md:col-span-2 md:grid-cols-subgrid">
                    <FormLabel className="md:col-span-1">Article</FormLabel>
                    <div className="md:col-span-1">
                      <FormControl>
                        <div
                          {...getArticleRootProps()}
                          className={cn(
                            'cursor-pointer rounded-lg border-2 border-dashed border-input p-4 text-center',
                            isArticleDragActive && 'border-primary'
                          )}
                        >
                          <input {...getArticleInputProps()} />
                          <Upload
                            strokeWidth={2}
                            className="mx-auto size-6 text-primary"
                          />
                          <p className="mt-2 text-sm">
                            Drop article or click to upload
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            DOCX only
                          </p>
                        </div>
                      </FormControl>
                      {articleFile && (
                        <div className="mt-2 flex items-center justify-between rounded-lg border border-border bg-accent/10 py-2 pl-3 pr-2 text-sm">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="mr-2 flex-1 truncate">
                              {articleFile.name}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeArticle}
                            disabled={isUpdateContributionPending}
                            className="size-7 flex-shrink-0 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <FormMessage className="mt-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[1fr,2fr]">
              <FormField
                control={updateContributionForm.control}
                name="agreed_to_terms"
                render={({ field }) => (
                  <FormItem className="col-span-full grid md:col-span-2 md:grid-cols-subgrid">
                    <div className="md:col-span-1">
                      <FormLabel>Terms and Conditions</FormLabel>
                    </div>
                    <div className="md:col-span-1">
                      <div className="flex flex-col space-y-3 rounded-lg border border-input p-4">
                        <div className="flex items-start space-x-4">
                          <FormControl>
                            <Checkbox
                              id="terms-checkbox"
                              className="mt-1 h-5 w-5"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isUpdateContributionPending}
                            />
                          </FormControl>
                          <div className="flex-1">
                            <label
                              htmlFor="terms-checkbox"
                              className="cursor-pointer text-sm font-medium"
                            >
                              I agree to the submission terms
                            </label>
                            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                              {[
                                'My submission is original and does not violate any copyrights',
                                'I grant permission for my submission to be published and displayed',
                                'I understand that my submission may be edited for clarity or length',
                              ].map((item, index) => (
                                <li key={index} className="flex items-center">
                                  <span className="mr-2 text-primary">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <FormMessage className="mt-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-full md:w-auto"
                loading={isUpdateContributionPending}
              >
                Update
              </Button>
            </div>
          </form>
        </Form>
      </div>
    )
  }

  return null
}

export default EditConntribution
