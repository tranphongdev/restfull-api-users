import { useEffect, useState } from 'react';
import { Button, Container, Table, Pagination } from 'react-bootstrap';

import ApiServices from '~/services/ApiServices';

function TableUsers() {
    const [dataUsers, setDataUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPage, setTotalPage] = useState(0);

    const getDataUsers = async () => {
        const response = await ApiServices.ApiGetUsers();
        if (response && response.data) {
            setTotalUsers(response.data.total);
            setDataUsers(response.data.data);
            setTotalPage(response.data.total_pages);
        }
    };

    console.log(totalUsers);

    useEffect(() => {
        getDataUsers();
    }, []);

    return (
        <Container>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {dataUsers?.map((item) => (
                        <tr key={item?.id}>
                            <td>{item?.id}</td>
                            <td>{item?.first_name}</td>
                            <td>{item?.last_name}</td>
                            <td>{item?.email}</td>
                            <td>
                                <Button className="btn btn-warning">Edit</Button>
                                <Button className="btn btn-danger">Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pagination>
                <Pagination.First />
                <Pagination.Prev />
                <Pagination.Item>{1}</Pagination.Item>
                <Pagination.Ellipsis />

                <Pagination.Item>{10}</Pagination.Item>
                <Pagination.Item>{11}</Pagination.Item>
                <Pagination.Item active>{12}</Pagination.Item>
                <Pagination.Item>{13}</Pagination.Item>
                <Pagination.Item disabled>{14}</Pagination.Item>

                <Pagination.Ellipsis />
                <Pagination.Item>{20}</Pagination.Item>
                <Pagination.Next />
                <Pagination.Last />
            </Pagination>
        </Container>
    );
}

export default TableUsers;
