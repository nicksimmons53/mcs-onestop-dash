import { Breadcrumb } from "semantic-ui-react";
import { useRouter } from "next/router";
import _ from "lodash";
import styles from "./file-trail.module.css";

const paths = {
  "Home": "",
  "Clients": "clients",
  "Dashboard": "dashboard",
  "Client Information": "[clientId]"
};

export default function FileTrail( ) {
  const router = useRouter();
  const path = router.pathname.split("/");

  if (path[1] === "") {
    path.pop(1);
  }

  return (
    <>
      <Breadcrumb size={"large"} className={styles.breadcrumb}>
        { path.map((page, index) => (
          <Breadcrumb.Section key={index}>
            { _.findKey(paths, (path) => path === page) }
            <Breadcrumb.Divider/>
          </Breadcrumb.Section>
        ))}
      </Breadcrumb>
    </>
  )
}