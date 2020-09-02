const URL = 'http://localhost:8080' // config?
showPackageListener = (e) => { 
    if(e.target.className) 
        showPackage(e.target.className)
}
const title = document.getElementById('title')
const content = document.getElementById('content')
content.addEventListener("click", showPackageListener)

async function fetchData(endpoint) {
   const response = await fetch(endpoint)
   const data = await response.json()
   return data
}

async function showPackageList() {
    title.innerText = 'Software package list:'
    content.innerHTML = ''
    const data = await fetchData(URL + '/packages')
    for (let package of data) {
        let dt = document.createElement('dt')
        dt.className = package['Package']
        dt.appendChild(document.createTextNode(package['Package']))
        dt.style=['text-decoration: underline;']
        content.appendChild(dt)
    }
} 

async function showPackage(package) {
    title.innerText = 'Details for the package:'
    const data = await fetchData(URL + '/packages/' + package)
    if(data['Package'] === undefined) return
    content.innerHTML = ''
    const listOrder = ['Package', 'Description', 'Dependencies', 'Reverse Dependencies']

    listOrder.forEach(key => {
        const element = document.createElement(key === listOrder[0] ? 'dt' : 'dd')
        element.appendChild(document.createTextNode(key + ': '))

        if(Array.isArray(data[key]))
            data[key].forEach(dependency => {
                const span_element = document.createElement("span")
                span_element.textContent = dependency.name + ' '
                dependency.clickable ? span_element.style=['text-decoration: underline;'] : span_element.style=[]
                element.appendChild(span_element)
                if(dependency.clickable)
                    span_element.addEventListener("click", () => showPackage(dependency.name))
            })
        else
            element.appendChild(document.createTextNode(data[key]))
        content.appendChild(element)
    })

    const back_element = document.createElement('span')
    back_element.textContent = 'Back'
    back_element.style=['text-decoration: underline;']
    back_element.addEventListener("click", () => showPackageList())
    content.appendChild(back_element)
}

showPackageList()