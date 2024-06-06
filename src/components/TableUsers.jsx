import { useEffect, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { IoMdPersonAdd } from 'react-icons/io';
import ReactPaginate from 'react-paginate';
import { FaRegTrashCan } from 'react-icons/fa6';
import { BiEdit } from 'react-icons/bi';
import _ from 'lodash';

import ApiServices from '~/services/ApiServices';
import ModalAddUser from './ModalAddUser';
import ModalEditUser from './ModalEditUser';

function TableUsers() {
    const [isShow, setIsShow] = useState(false);
    const [isShowEdit, setIsShowEdit] = useState(false);
    const [dataUsers, setDataUsers] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [dataUserEdit, setDataUserEdit] = useState({});

    const getDataUsers = async (page) => {
        const response = await ApiServices.ApiGetUsers(page);
        if (response && response.data) {
            setDataUsers(response.data.data);
            setTotalPage(response.data.total_pages);
        }
    };

    const handleClose = () => {
        setIsShow(false);
        setIsShowEdit(false);
    };
    const handleShow = () => setIsShow(true);

    const handlePageClick = (e) => {
        getDataUsers(+e.selected + 1);
    };

    const updateTable = (user) => {
        setDataUsers([user, ...dataUsers]);
    };

    const handleUpdateTableFromModal = (user) => {
        let cloneUsers = _.cloneDeep(dataUsers);
        let index = dataUsers.findIndex((item) => item.id === user.id);
        cloneUsers[index].first_name = user.first_name;
        setDataUsers(cloneUsers);
    };

    const handleEdit = (user) => {
        setDataUserEdit(user);
        setIsShowEdit(true);
    };

    useEffect(() => {
        getDataUsers(1);
    }, []);

    return (
        <Container>
            <div className="my-4 d-flex align-items-center justify-content-between">
                <h4 className="m-0">List Users</h4>
                <div>
                    <Button onClick={handleShow} className="btn btn-success d-flex align-items-center gap-2">
                        <IoMdPersonAdd /> Add new user
                    </Button>
                </div>
            </div>
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
                            <td className="d-flex align-items-center gap-2">
                                <Button onClick={() => handleEdit(item)} className="btn btn-warning">
                                    <BiEdit />
                                </Button>
                                <Button className="btn btn-danger">
                                    <FaRegTrashCan />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <ReactPaginate
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={totalPage}
                previousLabel="< previous"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
            />

            <ModalAddUser show={isShow} handleClose={handleClose} updateTable={updateTable} />
            <ModalEditUser
                show={isShowEdit}
                handleClose={handleClose}
                dataUserEdit={dataUserEdit}
                handleUpdateTableFromModal={handleUpdateTableFromModal}
            />
        </Container>
    );
}

export default TableUsers;
