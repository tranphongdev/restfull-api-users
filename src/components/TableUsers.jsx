import { useEffect, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { IoMdPersonAdd } from 'react-icons/io';
import ReactPaginate from 'react-paginate';
import { FaRegTrashCan, FaArrowDownLong, FaArrowUpLong, FaFileImport, FaDownload } from 'react-icons/fa6';
import { BiEdit } from 'react-icons/bi';
import _, { debounce } from 'lodash';
import Papa from 'papaparse';
import ApiServices from '~/services/ApiServices';
import ModalAddUser from './ModalAddUser';
import ModalEditUser from './ModalEditUser';
import ModalConfirm from './ModalConfirm';
import { CSVLink } from 'react-csv';
import { toast } from 'react-toastify';

function TableUsers() {
    const [isShow, setIsShow] = useState(false);
    const [isShowEdit, setIsShowEdit] = useState(false);
    const [isShowDel, setIsShowDel] = useState(false);
    const [dataUsers, setDataUsers] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [dataUserEdit, setDataUserEdit] = useState({});
    const [dataUserDelete, setDataUserDelete] = useState({});
    const [sort, setSort] = useState('asc');
    const [field, setField] = useState('id');
    const [dataExport, setDataExport] = useState([]);

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
        setIsShowDel(false);
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

    const handleDeleteFromModal = (id) => {
        setDataUsers(dataUsers.filter((user) => user.id !== id));
    };

    const handleEdit = (user) => {
        setDataUserEdit(user);
        setIsShowEdit(true);
    };

    const handleDel = (user) => {
        setDataUserDelete(user);
        setIsShowDel(true);
    };

    const handleSort = (type, field) => {
        setSort(type);
        setField(field);
        let cloneUsers = _.cloneDeep(dataUsers);
        cloneUsers = _.orderBy(cloneUsers, [field], [type]);
        setDataUsers(cloneUsers);
    };

    const handleSearch = debounce((e) => {
        let term = e.target.value;
        if (term) {
            let cloneUsers = _.cloneDeep(dataUsers);
            cloneUsers = cloneUsers.filter((item) => item.email.includes(term));
            setDataUsers(cloneUsers);
        } else {
            getDataUsers(1);
        }
    }, 400);

    const handleImport = (e) => {
        let file = e.target.files[0];

        if (file.type !== 'text/csv') {
            toast.error('Only accept CSV file');
            return;
        }

        Papa.parse(file, {
            complete: function (results) {
                let rawCSV = results.data;
                if (rawCSV.length > 0) {
                    if (rawCSV[0] && rawCSV[0].length === 3) {
                        if (rawCSV[0][0] !== 'email' || rawCSV[0][1] !== 'first_name' || rawCSV[0][2] !== 'last_name') {
                            toast.error('Wrong format Header CSV file');
                        } else {
                            let result = [];
                            rawCSV.forEach((item, index) => {
                                if (index > 0 && item.length === 3) {
                                    let obj = {
                                        id: index,
                                        email: item[0],
                                        first_name: item[1],
                                        last_name: item[2],
                                    };
                                    result.push(obj);
                                }
                            });
                            setDataUsers(result);
                        }
                    } else {
                        toast.error('Wrong format CSV file');
                    }
                } else {
                    toast.error('Wrong format CSV file');
                }
            },
        });
    };

    const getUsersExport = (e, done) => {
        let result = [];
        if (dataUsers && dataUsers.length > 0) {
            result.push(['ID', 'Email', 'First Name', 'Last Name']);
            dataUsers.forEach((item) => {
                let arr = [item.id, item.email, item.first_name, item.last_name];
                result.push(arr);
            });

            setDataExport(result);
            done();
        }
    };

    useEffect(() => {
        getDataUsers(1);
    }, []);

    return (
        <Container>
            <div className="my-4 d-flex align-items-center justify-content-between">
                <h4 className="m-0">List Users</h4>
                <div className="d-flex align-align-items-center gap-2">
                    <div className="d-flex align-items-center gap-2">
                        <label htmlFor="fileImport" className="btn btn-success">
                            <FaFileImport /> Import
                        </label>
                        <input
                            type="file"
                            onChange={handleImport}
                            name="fileImport"
                            id="fileImport"
                            className="d-none"
                        />
                    </div>
                    <div>
                        <CSVLink
                            data={dataExport}
                            onClick={getUsersExport}
                            asyncOnClick={true}
                            className="btn btn-success"
                        >
                            <FaDownload /> Export
                        </CSVLink>
                    </div>
                    <Button onClick={handleShow} className="btn btn-primary d-flex align-items-center gap-2">
                        <IoMdPersonAdd /> Add new user
                    </Button>
                </div>
            </div>

            <div className="my-4 col-4">
                <input
                    type="text"
                    onChange={(e) => handleSearch(e)}
                    className="form-control"
                    placeholder="Search user by email ..."
                />
            </div>

            <div className="table-over">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>
                                <div className="d-flex align-items-center justify-content-between">
                                    Id
                                    <div>
                                        <FaArrowDownLong type="button" onClick={() => handleSort('desc', 'id')} />
                                        <FaArrowUpLong type="button" onClick={() => handleSort('asc', 'id')} />
                                    </div>
                                </div>
                            </th>
                            <th>
                                <div className="d-flex align-items-center justify-content-between">
                                    First Name
                                    <div>
                                        <FaArrowDownLong
                                            type="button"
                                            onClick={() => handleSort('desc', 'first_name')}
                                        />
                                        <FaArrowUpLong type="button" onClick={() => handleSort('asc', 'first_name')} />
                                    </div>
                                </div>
                            </th>
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
                                    <Button onClick={() => handleDel(item)} className="btn btn-danger">
                                        <FaRegTrashCan />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

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
            <ModalConfirm
                show={isShowDel}
                handleClose={handleClose}
                dataUserDelete={dataUserDelete}
                handleDeleteFromModal={handleDeleteFromModal}
            />
        </Container>
    );
}

export default TableUsers;
