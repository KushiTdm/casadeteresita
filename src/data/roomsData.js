// src/data/roomsData.js

export const roomsDetailed = [
  {
    id: 'queen',
    slug: 'queen',
    available: 2,
    name: {
      en: 'Queen Room',
      es: 'Habitación Queen'
    },
    price: 60,
    size: 30,
    beds: {
      en: '1 large double bed',
      es: '1 cama doble grande'
    },
    rating: 9.4,
    reviewCount: 45,
    images: [
      '/queenBedDeluxe.jpg'
    ],
    description: {
      en: 'Providing free toiletries, this double room includes a private bathroom with a shower and a hairdryer...',
      es: 'Con artículos de tocador gratuitos, esta habitación doble incluye un baño privado...'
    },
    amenities: [
      { icon: 'Wifi', label: { en: 'Free WiFi', es: 'WiFi Gratis' } },
      { icon: 'Tv', label: { en: 'Flat-screen TV', es: 'TV Pantalla Plana' } },
      { icon: 'Bath', label: { en: 'Private Bathroom', es: 'Baño Privado' } },
      { icon: 'Trees', label: { en: 'Garden View', es: 'Vista al Jardín' } },
      { icon: 'Coffee', label: { en: 'Electric Kettle', es: 'Hervidor Eléctrico' } },
      { icon: 'Shirt', label: { en: 'Wardrobe', es: 'Armario' } }
    ],
    bathroom: {
      en: ['Free toiletries', 'Toilet', 'Bathtub or shower', 'Towels', 'Hairdryer', 'Toilet paper'],
      es: ['Artículos de tocador gratuitos', 'Inodoro', 'Bañera o ducha', 'Toallas', 'Secador de pelo', 'Papel higiénico']
    },
    view: {
      en: ['Garden view', 'Courtyard view'],
      es: ['Vista al jardín', 'Vista al patio']
    },
    features: {
      en: ['Parquet flooring', 'Socket near bed', 'Cable channels', 'Patio', 'Ground floor access'],
      es: ['Suelo de parquet', 'Enchufe cerca de la cama', 'Canales por cable', 'Patio', 'Acceso en planta baja']
    },
    included: {
      en: ['Breakfast included', 'Free cancellation'],
      es: ['Desayuno incluido', 'Cancelación gratuita']
    }
  },
  {
    id: 'deluxe-queen',
    slug: 'deluxe-queen',
    available: 1,
    name: {
      en: 'Deluxe Queen Room',
      es: 'Habitación Deluxe Queen'
    },
    price: 65,
    size: 30,
    beds: {
      en: '1 large double bed',
      es: '1 cama doble grande'
    },
    rating: 9.4,
    reviewCount: 45,
    images: [
      '/Deluxe-room.jpeg'
    ],
    description: {
      en: 'Providing free toiletries, this double room includes a private bathroom with a shower and a hairdryer...',
      es: 'Con artículos de tocador gratuitos, esta habitación doble incluye un baño privado...'
    },
    amenities: [
      { icon: 'Wifi', label: { en: 'Free WiFi', es: 'WiFi Gratis' } },
      { icon: 'Tv', label: { en: 'Flat-screen TV', es: 'TV Pantalla Plana' } },
      { icon: 'Bath', label: { en: 'Private Bathroom', es: 'Baño Privado' } },
      { icon: 'Trees', label: { en: 'Garden View', es: 'Vista al Jardín' } },
      { icon: 'Coffee', label: { en: 'Electric Kettle', es: 'Hervidor Eléctrico' } },
      { icon: 'Shirt', label: { en: 'Wardrobe', es: 'Armario' } }
    ],
    bathroom: {
      en: ['Free toiletries', 'Toilet', 'Bathtub or shower', 'Towels', 'Hairdryer', 'Toilet paper'],
      es: ['Artículos de tocador gratuitos', 'Inodoro', 'Bañera o ducha', 'Toallas', 'Secador de pelo', 'Papel higiénico']
    },
    view: {
      en: ['Garden view', 'Courtyard view'],
      es: ['Vista al jardín', 'Vista al patio']
    },
    features: {
      en: ['Parquet flooring', 'Socket near bed', 'Cable channels', 'Patio', 'Ground floor access'],
      es: ['Suelo de parquet', 'Enchufe cerca de la cama', 'Canales por cable', 'Patio', 'Acceso en planta baja']
    },
    included: {
      en: ['Breakfast included', 'Free cancellation'],
      es: ['Desayuno incluido', 'Cancelación gratuita']
    }
  },

  {
    id: 'single',
    slug: 'single',
    available: 2,
    name: {
      en: 'Single Room with Bathroom',
      es: 'Habitación Simple con Baño'
    },
    price: 40,
    size: 20,
    beds: {
      en: '1 single bed',
      es: '1 cama individual'
    },
    rating: 9.4,
    reviewCount: 45,
    images: [
      '/simpleRoom.jpg'
    ],
    description: {
      en: 'This single room is comprised of a flat-screen TV with cable channels...',
      es: 'Esta habitación individual cuenta con TV de pantalla plana...'
    },
    amenities: [
      { icon: 'Wifi', label: { en: 'Free WiFi', es: 'WiFi Gratis' } },
      { icon: 'Tv', label: { en: 'Flat-screen TV', es: 'TV Pantalla Plana' } },
      { icon: 'Bath', label: { en: 'Private Bathroom', es: 'Baño Privado' } },
      { icon: 'Trees', label: { en: 'Garden View', es: 'Vista al Jardín' } },
      { icon: 'Coffee', label: { en: 'Electric Kettle', es: 'Hervidor Eléctrico' } }
    ],
    bathroom: {
      en: ['Free toiletries', 'Toilet', 'Bathtub or shower', 'Hairdryer', 'Toilet paper'],
      es: ['Artículos de tocador gratuitos', 'Inodoro', 'Bañera o ducha', 'Secador de pelo', 'Papel higiénico']
    },
    view: {
      en: ['Garden view', 'Courtyard view', 'Patio'],
      es: ['Vista al jardín', 'Vista al patio', 'Patio']
    },
    features: {
      en: ['Parquet flooring', 'Socket near bed', 'Cable channels'],
      es: ['Suelo de parquet', 'Enchufe cerca de la cama', 'Canales por cable']
    },
    included: {
      en: ['Breakfast included', 'Free cancellation'],
      es: ['Desayuno incluido', 'Cancelación gratuita']
    }
  },

  {
    id: 'family',
    slug: 'family',
    available: 1,
    name: {
      en: 'Family Double Room',
      es: 'Habitación Doble Familiar'
    },
    price: 90,
    size: 50,
    beds: {
      en: '1 single bed and 2 large double beds',
      es: '1 cama individual y 2 camas dobles grandes'
    },
    rating: 9.4,
    reviewCount: 45,
    images: [
      '/doubleFamilial.jpg'
    ],
    description: {
      en: 'Offering free toiletries, this family room includes a private bathroom...',
      es: 'Con artículos de tocador gratuitos, esta habitación familiar incluye baño privado...'
    },
    amenities: [
      { icon: 'Wifi', label: { en: 'Free WiFi', es: 'WiFi Gratis' } },
      { icon: 'Tv', label: { en: 'Flat-screen TV', es: 'TV Pantalla Plana' } },
      { icon: 'Bath', label: { en: 'Private Bathroom', es: 'Baño Privado' } },
      { icon: 'Trees', label: { en: 'Garden View', es: 'Vista al Jardín' } },
      { icon: 'Users', label: { en: 'Family Friendly', es: 'Familiar' } },
      { icon: 'Coffee', label: { en: 'Electric Kettle', es: 'Hervidor Eléctrico' } },
      { icon: 'Shirt', label: { en: 'Wardrobe', es: 'Armario' } }
    ],
    bathroom: {
      en: ['Free toiletries', 'Toilet', 'Bathtub or shower', 'Hairdryer', 'Toilet paper'],
      es: ['Artículos de tocador gratuitos', 'Inodoro', 'Bañera o ducha', 'Secador de pelo', 'Papel higiénico']
    },
    view: {
      en: ['Garden view', 'City view', 'Courtyard view', 'Patio'],
      es: ['Vista al jardín', 'Vista a la ciudad', 'Vista al patio', 'Patio']
    },
    features: {
      en: ['Parquet flooring', 'Socket near bed', 'Cable channels'],
      es: ['Suelo de parquet', 'Enchufe cerca de la cama', 'Canales por cable']
    },
    included: {
      en: ['Breakfast included', 'Free cancellation'],
      es: ['Desayuno incluido', 'Cancelación gratuita']
    }
  },

  {
    id: 'twin',
    slug: 'twin',
    available: 2,
    name: {
      en: 'Twin Room',
      es: 'Habitación con Camas Gemelas'
    },
    price: 60,
    size: 25,
    beds: {
      en: '2 single beds',
      es: '2 camas individuales'
    },
    rating: 9.4,
    reviewCount: 45,
    images: [
      '/2litsSimples.jpg'
    ],
    description: {
      en: 'This twin room features cable flat-screen TV...',
      es: 'Esta habitación con camas gemelas cuenta con TV de pantalla plana...'
    },
    amenities: [
      { icon: 'Wifi', label: { en: 'Free WiFi', es: 'WiFi Gratis' } },
      { icon: 'Tv', label: { en: 'Flat-screen TV', es: 'TV Pantalla Plana' } },
      { icon: 'Bath', label: { en: 'Private Bathroom', es: 'Baño Privado' } },
      { icon: 'Trees', label: { en: 'Garden View', es: 'Vista al Jardín' } },
      { icon: 'Coffee', label: { en: 'Electric Kettle', es: 'Hervidor Eléctrico' } },
      { icon: 'Shirt', label: { en: 'Wardrobe', es: 'Armario' } }
    ],
    bathroom: {
      en: ['Free toiletries', 'Toilet', 'Bathtub or shower', 'Hairdryer', 'Toilet paper'],
      es: ['Artículos de tocador gratuitos', 'Inodoro', 'Bañera o ducha', 'Secador de pelo', 'Papel higiénico']
    },
    view: {
      en: ['Garden view', 'Courtyard view', 'Patio'],
      es: ['Vista al jardín', 'Vista al patio', 'Patio']
    },
    features: {
      en: ['Parquet flooring', 'Socket near bed', 'Cable channels'],
      es: ['Suelo de parquet', 'Enchufe cerca de la cama', 'Canales por cable']
    },
    included: {
      en: ['Breakfast included', 'Free cancellation'],
      es: ['Desayuno incluido', 'Cancelación gratuita']
    }
  }
];

export const reviews = [
  {
    id: 1,
    name: "Sarah M.",
    country: "USA",
    rating: 10,
    text: {
      en: "A perfect mix between hotel and museum...",
      es: "Una mezcla perfecta entre hotel y museo..."
    }
  },
  {
    id: 2,
    name: "Carlos R.",
    country: "Argentina",
    rating: 9.5,
    text: {
      en: "The gardens are beautiful...",
      es: "Los jardines son hermosos..."
    }
  }
];
