import Toast from 'react-native-toast-message';

const withToast = (Component) => (props) => {
    const showToast = (message, type = "info") => {
        if (["success", "error", "info"].includes(type)) {
            Toast.show({
                type: type,
                position: 'top',
                text1: message,
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 30,
                bottomOffset: 40,
            });
        } else {
            Toast.show({
                type: 'danger',
                position: 'top',
                text1: message,
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 30,
                bottomOffset: 40,
            });
        }
    }

    return (
        <>
            <Component {...props} showToast={showToast} />
            <Toast ref={(ref) => Toast.setRef(ref)} />
        </>
    )
}

export default withToast;