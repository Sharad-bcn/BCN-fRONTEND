export default function Main() {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then(permissionStatus => {
          if (permissionStatus.state === 'granted') {
            // If permission is granted, use the original Main function to get the location
            detectLocation().then(resolve).catch(reject)
          } else if (permissionStatus.state === 'prompt') {
            // If permission is prompt (neither granted nor denied), ask the user to enable location services
            detectLocation().then(resolve).catch(reject)
          } else {
            // If permission is denied, reject the Promise with an error message
            reject('Location access denied. Please enable location services in your browser settings.')
          }
        })
        .catch(error => {
          console.error('Error checking location permission:', error)
          reject('Error checking location permission.')
        })
    } else {
      console.error('Geolocation is not available in this browser.')
      reject('Geolocation is not available in this browser.')
    }
  })
}

function detectLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords
        resolve({ latitude, longitude })
      },
      error => {
        console.error('Error getting user location:', error)
        reject('Location access denied or unavailable. Please check your browser settings.')
      }
    )
  })
}
