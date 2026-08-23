export const programs = [
  { title: 'Madin Awaliyah', icon: '/icons/ic-book.png', key: 'madin-awaliyah' },
  { title: 'TPQ', icon: '/icons/ic-globe.png', key: 'tpq' },
  { title: 'Madin Wustho', icon: '/icons/ic-neraca.png', key: 'madin-wustho' },
  { title: 'PonPes Salafiyah', icon: '/icons/ic-komputer.png', key: 'ponpes-salafiyah' },
]

export const fallbackPhotos = [
  '/images/foto-keg-1.jpg', '/images/foto-keg-2.jpg', '/images/foto-keg-3.jpg',
  '/images/foto-keg-4.jpg', '/images/foto-keg-5.jpg', '/images/foto-keg-6.jpg',
].map((image, index) => ({ id: `fallback-${index + 1}`, image, title: `Foto Kegiatan ${index + 1}` }))

export const contact = {
  whatsapp: '62816401942',
  email: 'ypspp.nurulhuda@gmail.com',
  phone: '0856-3655-915',
  instagram: '',
  facebook: 'https://www.facebook.com/pondoknurulhuda',
  youtube: 'https://www.youtube.com/@nurulhudaburno',
  address: 'Jalan Ranupani RT.006/RW.001, Krajan Satu, Burno, Kec. Senduro, Kabupaten Lumajang, Jawa Timur 67361',
}
