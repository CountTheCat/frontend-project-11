export default (xmlString) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'application/xml')

  const errorNode = doc.querySelector('parsererror')
  if (errorNode) {
    throw new Error('parse')
  }

  const title = doc.querySelector('channel > title')?.textContent || 'Без названия'
  const description = doc.querySelector('channel > description')?.textContent || 'Без описания'

  const items = [...doc.querySelectorAll('item')].map((item, index) => ({
    id: `${item.querySelector('guid')?.textContent || item.querySelector('link')?.textContent || index}`,
    title: item.querySelector('title')?.textContent || 'Без названия',
    link: item.querySelector('link')?.textContent || '#',
    description: item.querySelector('description')?.textContent || '',
  }))

  return {
    feed: { title, description },
    posts: items,
  }
}
