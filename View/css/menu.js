
var menuItem = document.querySelectorAll('.item-menu')

function selectLink(){
    menuItem.forEach((item)=>
        item.classList.remove('item-select')
    )
    this.classList.add('item-select')
}

menuItem.forEach((item)=>
    item.addEventListener('click', selectLink)
)