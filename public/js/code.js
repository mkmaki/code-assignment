const URL = 'http://localhost:8080'
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

    const dt = document.createElement('dt')

    const dt_text = document.createTextNode(data['Package'])
    dt.appendChild(dt_text)
    content.appendChild(dt)

    const dd1 = document.createElement('dd')
    content.appendChild(dd1)
    const dd1_text = document.createTextNode('Description: ' + data['Description'])
    dd1.appendChild(dd1_text)

    const dd2 = document.createElement('dd')
    content.appendChild(dd2)
    const dd2_text = document.createTextNode('Dependencies: ')
    dd2.appendChild(dd2_text)

    data['Depends'].forEach(dependency => {
        const ele = document.createElement("span")
        ele.textContent = dependency.name + '   '
        dependency.clickable ? ele.style=['text-decoration: underline;'] : ele.style=[]
        dd2.appendChild(ele)
        if(dependency.clickable)
            ele.addEventListener("click", () => showPackage(dependency.name))
    })
    const dd3 = document.createElement('dd')
    content.appendChild(dd3)
    const dd3_text = document.createTextNode('Reverse dependencies: ')
    dd3.appendChild(dd3_text)

    data['ReverseDependencies'].forEach(dependency => {
        const ele = document.createElement("span")
        ele.textContent = dependency.name + '   '
        dependency.clickable ? ele.style=['text-decoration: underline;'] : ele.style=[]
        dd3.appendChild(ele)
        if(dependency.clickable)
            ele.addEventListener("click", () => showPackage(dependency.name))
    })

    const back = document.createElement('span')
    back.textContent = 'Back'
    back.style=['text-decoration: underline;']
    back.addEventListener("click", () => showPackageList())
    content.appendChild(back)
}

showPackageList()