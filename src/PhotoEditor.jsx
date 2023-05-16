import { useState, useRef } from 'react'
import defaultBorder from './defaultBorder.png'
import { ReactComponent as InstagramIcon } from './instagram-1-svgrepo-com.svg'
import { ReactComponent as FacebookIcon } from './facebook-1-svgrepo-com.svg'
import Facebook from './Facebook'

const PhotoEditor = () => {
  const [uploadPhotoUrl, setUploadPhotoUrl] = useState()
  const [isBorderExist, setIsBorderExist] = useState(false)
  const canvasRef = useRef()
  const testUrl = `https://www.facebook.com/sharer/sharer.php?u=https://images.pexels.com/photos/14744773/pexels-photo-14744773.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load`
  const handleUploadPhoto = (e) => {
    if (e.target.files[0]) {
      setUploadPhotoUrl(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleBorderDisplay = () => {
    setIsBorderExist(!isBorderExist)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const img = new Image()
    img.crossOrigin = 'anonymous' // 設定跨域
    img.onload = () => {
      const canvasWidth = img.width
      const canvasHeight = img.height
      canvas.width = canvasWidth
      canvas.height = canvasHeight

      context.drawImage(img, 0, 0, canvasWidth, canvasHeight)
      if (isBorderExist) {
        const border = new Image()
        border.crossOrigin = 'anonymous' // 設定跨域
        border.onload = () => {
          context.drawImage(border, 0, 0, canvasWidth, canvasHeight)
          const downloadLink = document.createElement('a')
          downloadLink.setAttribute('download', 'photo.png')
          if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
            // 如果是 iOS 系統，調用相簿 API 進行存儲
            canvas.toBlob((blob) => {
              const url = URL.createObjectURL(blob)
              const anchor = document.createElement('a')
              anchor.href = url
              anchor.setAttribute('download', 'photo.png')
              anchor.style.display = 'none'
              document.body.appendChild(anchor)
              anchor.click()
              document.body.removeChild(anchor)
              URL.revokeObjectURL(url)
              const reader = new FileReader()
              reader.readAsDataURL(blob)
              reader.onloadend = () => {
                const base64data = reader.result
                const xhr = new XMLHttpRequest()
                xhr.open('POST', 'https://api.imgur.com/3/image')
                xhr.setRequestHeader('Authorization', 'Client-ID xxxxxxxxxxxx') // 設定你的 imgur client ID
                xhr.onload = () => {
                  const response = JSON.parse(xhr.responseText)
                  if (response.success) {
                    const imageUrl = response.data.link
                    window.location.href = imageUrl // 跳轉到圖片頁面
                  } else {
                    alert('Upload failed.')
                  }
                }
                xhr.onerror = () => {
                  alert('Upload failed.')
                }
                const formData = new FormData()
                formData.append('image', base64data)
                xhr.send(formData)
              }
            }, 'image/png')
          } else {
            // 否則直接下載
            downloadLink.setAttribute(
              'href',
              canvas
                .toDataURL('image/png')
                .replace('image/png', 'image/octet-stream')
            )
            downloadLink.click()
          }
        }
        border.src = defaultBorder
      } else {
        const downloadLink = document.createElement('a')
        downloadLink.setAttribute('download', 'photo.png')
        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
          canvas.toBlob((blob) => {
            const image = new Image()
            image.src = URL.createObjectURL(blob)
            const anchor = document.createElement('a')
            anchor.href = image.src
            anchor.download = 'photo.png'
            anchor.style.display = 'none'
            document.body.appendChild(anchor)
            anchor.click()
            setTimeout(() => {
              document.body.removeChild(anchor)
              URL.revokeObjectURL(image.src)
            }, 1000)
          }, 'image/png')
        } else {
          downloadLink.setAttribute(
            'href',
            canvas
              .toDataURL('image/png')
              .replace('image/png', 'image/octet-stream')
          )
          downloadLink.click()
        }
      }
    }
    img.src = uploadPhotoUrl
  }

  return (
    <div className='w-screen h-screen flex flex-col justify-start items-center mt-4'>
      <div className='w-[300px] h-[300px] border-4 grey-red-400 relative'>
        <img
          src={uploadPhotoUrl}
          className='w-full h-full object-contain'
          alt=''
        />
        <img
          src={isBorderExist && defaultBorder}
          className='absolute inset-0'
          alt=''
        />
        <div>
          <canvas
            ref={canvasRef}
            className='border border-red-400 absolute top-0 left-0 z-30 '
          />
        </div>
      </div>
      <label
        htmlFor='uploadPhoto'
        className='bg-green-600 px-8 py-2 rounded mt-4 text-white cursor-pointer'
      >
        上傳照片
      </label>
      <input
        type='file'
        id='uploadPhoto'
        accept='image/png,image/jpeg,image/jpg'
        className='hidden'
        onChange={handleUploadPhoto}
      />
      <button
        className='bg-red-600 px-8 py-2 rounded mt-4 text-white'
        onClick={handleBorderDisplay}
      >
        {isBorderExist ? '取消邊框' : '加上邊框'}
      </button>
      <button
        className='bg-blue-600 px-8 py-2 rounded mt-4 text-white'
        onClick={handleDownload}
      >
        下載照片
      </button>
      {/* <a href='https://www.instagram.com' className=''>
        <InstagramIcon className='w-[50px] h-[50px] mt-4' />
      </a>
      <a href='https://www.instagram.com' className=''>
        <FacebookIcon className='w-[50px] h-[50px] mt-4' />
      </a> */}
      <a target='_blank' rel='noreferrer' href={testUrl}>
        <div className='px-12 py-6 bg-slate-600 text-white'>測試</div>
      </a>
    </div>
  )
}

export default PhotoEditor
