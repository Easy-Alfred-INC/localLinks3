
function handleCostColumn (form){
    // console.log('form123', form)
    if (form.budget && form.guestCount && form.hourCount) return form.budget * form.guestCount * form.hourCount
    if (form.budget && form.guestCount) return form.budget * form.guestCount
    if (form.budget && form.hourCount) return form.budget * form.hourCount
    return form.budget
}

function handleGuestAndHourCount(form) {
    // console.log('form12', form)
    const costLabel = form.priceType.includes('range') ? 'budget' : 'price'
    if (form.guestCount && form.hourCount){
        return `${form.priceQuantifier1}s:${form.guestCount} * ${form.priceQuantifier2}s:${form.hourCount} * ${costLabel}:$${form.budget}`
    }
    if (form.guestCount){
        return `${form.priceQuantifier1}s:${form.guestCount} *  ${costLabel}:$${form.budget}`
    }
    if (form.hourCount){
        return `${form.priceQuantifier2}s:${form.hourCount} *  ${costLabel}:$${form.budget}`
    }
    return `${costLabel}:$${form.budget}`
}


function handleTotalCostChip (eventRows){
    // console.log('form1', eventRows)
    let totalCost = eventRows.reduce((a, b)=>{
        if (b.isLocked) return a
        if (b.priceQuantifier1 && b.priceQuantifier2) return a + (+b.budget * +b.guestCount * +b.hourCount) 
        if (b.priceQuantifier1) return a + (+b.budget * +b.guestCount) 
        if (b.priceQuantifier2) return a + (+b.budget * +b.hourCount) 
        return a + +b.budget
    }, 0)
    return `TOTAL COST: $${totalCost}`
}

function handleTotalCostChipUnconfirmed(eventRows) {
    console.log('form1', eventRows)
    let totalCost = eventRows.reduce((a, b) => {
        if (b.isLocked) return a
        if (b.isConfirmed) return a
        if (b.priceQuantifier1 && b.priceQuantifier2) return a + (+b.budget * +b.guestCount * +b.hourCount)
        if (b.priceQuantifier1) return a + (+b.budget * +b.guestCount)
        if (b.priceQuantifier2) return a + (+b.budget * +b.hourCount)
        return a + +b.budget
    }, 0)
    return `TOTAL COST: $${totalCost}`
}

  
export { handleTotalCostChipUnconfirmed, handleTotalCostChip, handleCostColumn, handleGuestAndHourCount };