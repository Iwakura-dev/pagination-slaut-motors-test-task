import Head from 'next/head';
import { Inter } from 'next/font/google';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Alert, Container, Row, Col } from 'react-bootstrap';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Inter({ subsets: ['latin'] });

type TUserItem = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    updatedAt: string;
};

type TGetServerSideProps = {
    statusCode: number;
    users: TUserItem[];
};

export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
    try {
        const res = await fetch('http://localhost:3000/users', { method: 'GET' });
        if (!res.ok) {
            return { props: { statusCode: res.status, users: [] } };
        }

        return {
            props: { statusCode: 200, users: await res.json() },
        };
    } catch (e) {
        return { props: { statusCode: 500, users: [] } };
    }
}) satisfies GetServerSideProps<TGetServerSideProps>;

export default function Home({ statusCode, users }: TGetServerSideProps) {
    if (statusCode !== 200) {
        return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>;
    }
    const [currentPage, setCurrentPage] = useState(1);
    const COUNT_ITEMS = 20;
    const indexOfLastUsers = currentPage * COUNT_ITEMS;
    const indexOfFirstUsers = indexOfLastUsers - COUNT_ITEMS;
    const currentUsers = Array.isArray(users) ? users.slice(indexOfFirstUsers, indexOfLastUsers) : [];
    const handlePagination = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    return (
        <>
            <Head>
                <title>Тестовое задание</title>
                <meta name="description" content="Тестовое задание" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={inter.className}>
                <Container>
                    <h1 className={'mb-5'}>Пользователи</h1>
                    <Container className={'mb-2'}>
                        <Row>
                            <Col>
                                <Button
                                    variant="danger"
                                    disabled={currentPage === 1}
                                    onClick={() => handlePagination(currentPage - 1)}>
                                    Prev
                                </Button>
                            </Col>
                            <Col xs={'1'}>
                                <Button
                                    type="button"
                                    variant="success"
                                    disabled={currentPage === Math.ceil(users.length ?? 0) / COUNT_ITEMS}
                                    onClick={() => handlePagination(currentPage + 1)}>
                                    Next
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Имя</th>
                                <th>Фамилия</th>
                                <th>Телефон</th>
                                <th>Email</th>
                                <th>Дата обновления</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user, idx) => (
                                <tr key={`Key with-${idx}`}>
                                    <td>{user.id}</td>
                                    <td>{user.firstname}</td>
                                    <td>{user.lastname}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.email}</td>
                                    <td>{user.updatedAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/*TODO add pagination*/}
                </Container>
            </main>
        </>
    );
}
