module.exports = (req, messages) => {
    Object.keys(messages).forEach(type => {
        messages[type].forEach(text => {
            req.flash(type, text)
        })
    })
};