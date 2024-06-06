import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ApiServices from '~/services/ApiServices';
import { toast } from 'react-toastify';

function ModalConfirm(props) {
    const { show, handleClose, dataUserDelete, handleDeleteFromModal } = props;

    const handleSubmit = async () => {
        toast.promise(
            ApiServices.ApiDeleteUser(dataUserDelete?.id)
                .then((response) => {
                    if (response.status === 204) {
                        handleDeleteFromModal(dataUserDelete?.id);
                    } else {
                        toast.error('Failed to delete user!');
                    }
                })
                .catch((error) => {
                    console.error('Error deleting user:', error);
                    throw new Error('Failed to delete user');
                }),
            {
                pending: 'Deleting user...',
                success: 'User deleted successfully!',
                error: 'Failed to delete user',
            },
        );
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Do you want to delete the user with email: <strong>{dataUserDelete?.email}</strong>?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalConfirm;
