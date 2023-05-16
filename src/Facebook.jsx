import { Helmet } from 'react-helmet'
import { useEffect } from 'react'

const Facebook = () => {
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '556747509958413',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v13.0',
      })
    }

    // ...

    if (window.FB) {
      window.FB.XFBML.parse()
    }
  }, [])

  function shareToFacebook(imageUrl) {
    window.FB.ui(
      {
        method: 'share',
        href: imageUrl,
      },
      function (response) {
        // 处理分享操作的回调
        if (response && !response.error_message) {
          console.log('分享成功！')
        } else {
          console.error('分享失败！')
        }
      }
    )
  }
  const checkLoginStatus = () => {
    window.FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        // User is logged in and has authorized your app
        console.log('User is logged in to Facebook.')
      } else if (response.status === 'not_authorized') {
        // User is logged in to Facebook, but has not authorized your app
        console.log('User has not authorized the app.')
      } else {
        // User is not logged in to Facebook
        console.log('User is not logged in to Facebook.')
        // Trigger Facebook login
        loginToFacebook()
      }
    })
  }
  const loginToFacebook = () => {
    window.FB.login(
      function (loginResponse) {
        if (loginResponse.authResponse) {
          // User has logged in and authorized your app
          console.log('User has logged in to Facebook.')
        } else {
          // User cancelled the login process
          console.log('User cancelled the login.')
        }
      },
      { scope: 'publish_to_groups,publish_video' }
    )
  }

  const handleUpload = () => {
    window.FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        // User is logged in and has authorized your app
        uploadPhoto(response.authResponse.accessToken)
      } else if (response.status === 'not_authorized') {
        // User is logged in to Facebook, but has not authorized your app
        console.log('User has not authorized the app.')
      } else {
        // User is not logged in to Facebook
        console.log('User is not logged in to Facebook.')
        // Trigger Facebook login
        window.FB.login(
          function (loginResponse) {
            if (loginResponse.authResponse) {
              // User has logged in and authorized your app
              uploadPhoto(loginResponse.authResponse.accessToken)
            } else {
              // User cancelled the login process
              console.log('User cancelled the login.')
            }
          },
          { scope: 'publish_to_groups,publish_video' }
        ) // Add additional permissions if needed
      }
    })
  }

  const uploadPhoto = (accessToken) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (event) => {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        const dataUrl = reader.result
        const blob = dataURLToBlob(dataUrl)
        const formData = new FormData()
        formData.append('source', blob, file.name)

        fetch(
          `https://graph.facebook.com/me/photos?access_token=1599036157253045|j905vDTagBNVR68FTef1evNcnQk`,
          {
            method: 'POST',
            body: formData,
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log('Photo uploaded successfully:', data)
            // Handle success, display feedback to the user, etc.
          })
          .catch((error) => {
            console.error('Error uploading photo:', error)
            // Handle error, display error message to the user, etc.
          })
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  const dataURLToBlob = (dataURL) => {
    const parts = dataURL.split(';base64,')
    const contentType = parts[0].split(':')[1]
    const byteString = atob(parts[1])
    let arrayBuffer = new ArrayBuffer(byteString.length)
    let uint8Array = new Uint8Array(arrayBuffer)

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i)
    }

    return new Blob([arrayBuffer], { type: contentType })
  }
  const handleShareClick = () => {
    const imageUrl =
      'https://images.pexels.com/photos/14744773/pexels-photo-14744773.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load'
    shareToFacebook(imageUrl)
  }

  return (
    <div>
      <div id='fb-root'></div>
      <Helmet>
        <script
          async
          defer
          crossorigin='anonymous'
          src='https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v13.0&appId=556747509958413&autoLogAppEvents=1'
          nonce='YOUR_NONCE_VALUE'
        ></script>
      </Helmet>
      <div>
        <button onClick={handleShareClick}>分享到 Facebook</button>
      </div>
    </div>
  )
}

export default Facebook
