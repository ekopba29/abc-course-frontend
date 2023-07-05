import { GetServerSideProps } from "next";
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';

export default function CallbackGoogle() {
}

export const getServerSideProps: GetServerSideProps = async ({ res, query, req }) => {
    setCookie('token', query.access_token, { req, res, maxAge: 3600 });
    setCookie('membership', query.membership, { req, res, maxAge: 3600 });
    setCookie('email', String(query.email).replace("%40","@"), { req, res, maxAge: 3600 });
    return {
        redirect: {
            permanent: false,
            destination: "/",
          },
    };
};