import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import ApiServices from '~/services/ApiServices';
import { toast } from 'react-toastify';

function ModalAddUser(props) {
    const { show, handleClose, updateTable } = props;
    const [name, setName] = useState('');
    const [job, setJob] = useState('');

    const handleSubmit = async () => {
        if (name === '' || job === '') {
            toast.error('Form not empty!');
        } else {
            toast.promise(
                ApiServices.ApiPostUser(name, job)
                    .then((response) => {
                        if (response) {
                            handleClose();
                            setJob('');
                            setName('');
                            updateTable({
                                id: response.data.id,
                                first_name: name,
                                job: job,
                            });
                        } else {
                            toast.error('Add user failed!');
                        }
                    })
                    .catch((error) => {
                        console.error('Error adding user:', error);
                        throw new Error('Failed to add user');
                    }),
                {
                    pending: 'Adding user...',
                    success: 'User added successfully!',
                    error: 'Failed to add user',
                },
            );
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add new user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
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
        </>
    );
}

export default ModalAddUser;
