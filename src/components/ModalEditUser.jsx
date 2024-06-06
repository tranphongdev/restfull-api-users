import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import ApiServices from '~/services/ApiServices';
import { toast } from 'react-toastify';

function ModalEditUser(props) {
    const { show, handleClose, dataUserEdit, handleUpdateTableFromModal } = props;
    const [name, setName] = useState('');
    const [job, setJob] = useState('');

    const handleSubmit = async () => {
        toast.promise(
            ApiServices.ApiUpdateUser(dataUserEdit.id, name, job)
                .then(() => {
                    handleUpdateTableFromModal({
                        first_name: name,
                        id: dataUserEdit.id,
                    });
                    handleClose();
                })
                .catch((error) => {
                    console.error('Error updating user:', error);
                    throw new Error('Failed to update user');
                }),
            {
                pending: 'Updating user...',
                success: 'User updated successfully!',
                error: 'Failed to update user',
            },
        );
    };

    useEffect(() => {
        if (show && dataUserEdit) {
            setName(dataUserEdit.first_name || '');
            setJob(dataUserEdit.job || ''); // Assuming dataUserEdit has a job property
        }
        // Optional cleanup to reset state when modal is closed
        return () => {
            if (!show) {
                setName('');
                setJob('');
            }
        };
    }, [dataUserEdit, show]);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formJob">
                        <Form.Label>Job:</Form.Label>
                        <Form.Control type="text" value={job} onChange={(e) => setJob(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalEditUser;
