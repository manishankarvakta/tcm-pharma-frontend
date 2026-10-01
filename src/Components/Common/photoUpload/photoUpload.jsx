import { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDropzone } from 'react-dropzone'
import Cropper from 'react-easy-crop'
import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap'
import { FaArrowRotateRight, FaArrowRotateLeft, FaCrop } from "react-icons/fa6"
import { LiaSearchPlusSolid, LiaSearchMinusSolid } from "react-icons/lia"
import { getCroppedImg } from './cropPhoto'
import { ImageOutlined } from '@mui/icons-material'
import logo from '../../../logo.png'
import { Check, X } from 'heroicons-react'
import axios from 'axios'
import AlertService from '../../Utility/AlertService'

const PhotoUploader = ({
  uploadSuccess,
  aspectRatio = 4 / 3,
  folderName = 'uploads',
  maxFileSize = 5 * 1024 * 1024,
  acceptedFileTypes = ['image/jpeg', 'image/png'],
  image
}) => {
  // console.log("Image", image)
  // const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  const BASE_URL = "https://pharmaapi.aamardokan.online/api";

  const PROXY_URL = `${BASE_URL}/fileManager/photo-url/`
  // console.log("Image URL", PROXY_URL)

  // console.log("Base URL", BASE_URL)
  const [selectedFile, setSelectedFile] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [screenName, setScreenName] = useState("preview-screen")
  const [preview, setPreview] = useState(image || logo)


  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles?.length) {
      AlertService.alert('Error', 'Unsupported file type or size too large', 'error')
      return
    }

    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(URL.createObjectURL(file))
      setScreenName("crop-screen")
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.join(','),
    multiple: false,
    maxSize: maxFileSize
  })

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCancel = () => {
    setSelectedFile(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    setCroppedImage(null)
    setUploadProgress(0)
  }

  const handleCrop = async () => {
    setIsLoading(true)
    try {
      const croppedImage = await getCroppedImg(
        selectedFile,
        croppedAreaPixels,
        rotation
      )
      setCroppedImage(croppedImage)
    } catch (e) {
      console.error(e)
    }
    setIsLoading(false)
  }

  const handleUpload = async () => {
    if (!croppedImage) return

    setIsLoading(true)
    try {
      // Convert cropped image URL to Blob
      const blob = await fetch(croppedImage).then(r => r.blob())
      const file = new File([blob], `cropped-${Date.now()}.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now()
      })

      // Create form data according to your API requirements
      const formData = new FormData()
      formData.append("photo", file)
      formData.append("bucketName", folderName) // Using folderName prop as bucket name

      console.log("Form Data", formData)

      const response = await axios.post(`${BASE_URL}/fileManager/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setUploadProgress(progress)
        }
      })

      if (response.data.url) {
        // Call success callback with the received URL
        // if (uploadSuccess) {
        // console.log("Upload Success", response.data)
        uploadSuccess(response.data.url)
        setPreview(`${PROXY_URL}${encodeURIComponent(response?.data.url)}`)
        setSelectedFile(null)
        setScreenName("preview-screen")
        // }
        // If you need to maintain internal state
        setCroppedImage(null)
      }

    } catch (err) {
      console.error("Upload failed:", err)
      // Optional: Add error handling/display
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
    }
  }

  const handleClose = () => {
    if (image !== null) {
      console.log("Image", image)
      setPreview(`${PROXY_URL}${encodeURIComponent(image)}`)
    } else {
      setPreview(logo)
    }
    setScreenName("preview-screen");
    setSelectedFile(null);
    handleCancel()
  }

  useEffect(() => {
    if (croppedImage !== null) {
      setPreview(croppedImage)
      setScreenName("preview-screen")
    }
  }, [croppedImage])

  useEffect(() => {
    console.log("Image", image)
    if (image !== null) {
      setPreview(`${PROXY_URL}${encodeURIComponent(image)}`)
      console.log("Image 1", `${PROXY_URL}${encodeURIComponent(image)}`)
      // setScreenName("preview-screen")
    }
  }, [image, PROXY_URL])

  // console.log("Preview", image, preview)
  return (
    <Container className="my-5">
      <Row className="g-4">
        {/* Dynamic View Screen */}
        <Col md={12}>
          <Card className="h-100">
            <Card.Body>

              {screenName === "preview-screen" ?
                <div>
                  {
                    selectedFile ?
                      <div className=' position-absolute bottom-0 end-0 marginRight-2'>
                        <Button
                          variant="dark"
                          className="mb-3"
                          onClick={handleClose}
                          disabled={isLoading}
                        >
                          <X style={{ width: '1.2rem' }} />
                        </Button>
                        <Button
                          variant="success"
                          className="mb-3"
                          onClick={handleUpload}
                          disabled={isLoading}
                        >
                          <Check style={{ width: '1.2rem' }} />
                        </Button>
                      </div>
                      : (
                        <Button
                          variant="dark"
                          className="mb-3 position-absolute top-0 end-0  margin-1"
                          onClick={() => setScreenName("dropzone-screen")}
                          disabled={isLoading}
                        >
                          <ImageOutlined style={{ width: '1.2rem' }} />
                        </Button>
                      )
                  }

                  {/* <img
                    src={`${BASE_URL}fileManager/photo-url/${encodeURIComponent(image)}`}
                    alt="Preview"
                    className="img-fluid"
                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                    /> */}
                  <img
                    src={preview}
                    alt="Preview"
                    className="img-fluid"
                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                  />
                </div>
                : screenName === "crop-screen" ?
                  <>
                    <div className="position-relative" style={{ height: '400px' }}>
                      <Cropper
                        image={selectedFile}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={aspectRatio}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                        onCropComplete={onCropComplete}
                        cropShape="rect"
                        showGrid={false}
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-secondary"
                          onClick={() => setZoom(Math.min(zoom + 0.1, 3))}
                        >
                          <LiaSearchPlusSolid style={{ width: '1.2rem' }} />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() => setZoom(Math.max(zoom - 0.1, 1))}
                        >
                          <LiaSearchMinusSolid style={{ width: '1.2rem' }} />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() => setRotation((prev) => (prev - 90) % 360)}
                        >
                          <FaArrowRotateLeft style={{ width: '1.2rem' }} />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() => setRotation((prev) => (prev + 90) % 360)}
                        >
                          <FaArrowRotateRight style={{ width: '1.2rem' }} />
                        </Button>
                      </div>

                      <div className="d-flex gap-2">
                        <Button variant="dark" onClick={handleClose}>
                          Cancel
                        </Button>
                        <Button
                          variant="dark"
                          onClick={handleCrop}
                          disabled={isLoading}
                        >
                          <FaCrop style={{ width: '1.2rem', marginRight: '0.5rem' }} />
                          Crop
                        </Button>
                      </div>
                    </div>
                  </>
                  : (
                    <div>
                      <Button
                        variant="dark"
                        className="mb-3  position-absolute top-0 end-0  margin-1"
                        onClick={handleClose}
                        disabled={isLoading}
                      >
                        <X style={{ width: '1.2rem' }} />
                      </Button>
                      <div
                        {...getRootProps()}
                        className={`dropzone ${isDragActive ? 'active' : ''}`}
                        style={{
                          border: '2px dashed #666',
                          borderRadius: '8px',
                          padding: '3rem',
                          textAlign: 'center',
                          cursor: 'pointer',
                          backgroundColor: isDragActive ? '#f8f9fa' : 'transparent',
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <input {...getInputProps()} />
                        <div className="mb-2">
                          <ImageOutlined style={{ width: '5rem' }} />
                          <p>Drag & drop a photo here, or click to select</p>
                        </div>
                        <small className="text-muted">
                          Supported formats: {acceptedFileTypes.join(', ').replace('image/', '')}
                          <br />(Max size: {maxFileSize / 1024 / 1024}MB)
                        </small>
                      </div>
                    </div>
                  )
              }
            </Card.Body>
          </Card>
        </Col>
        {/* Dynamic View Screen */}

      </Row>
    </Container>
  )
}

PhotoUploader.propTypes = {
  uploadSuccess: PropTypes.func.isRequired,
  aspectRatio: PropTypes.number,
  folderName: PropTypes.string,
  maxFileSize: PropTypes.number,
  acceptedFileTypes: PropTypes.arrayOf(PropTypes.string)
}

export default PhotoUploader