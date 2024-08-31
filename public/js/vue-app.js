const { createApp, ref } = Vue
const { ElMessage, ElMessageBox } = ElementPlus;

const btn_del = createApp({
    setup(){
        const open = (event) => {
            event.preventDefault()
            ElMessageBox.confirm(
                'The items will be permanently deleted. Do you want to continue?',
                'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning',
                }
            ).then(() => {
                delPart()
            }).catch(() => {
                // ElMessage({
                //     type: 'info',
                //     message: 'Delete canceled',
                // })
            })
        }
        return {
            open
        }
    }

})
btn_del.use(ElementPlus)
btn_del.mount('#btn-del-container')