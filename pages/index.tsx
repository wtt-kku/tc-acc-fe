import Head from "next/head";
import Image from "next/image";

import styles from "@/styles/Home.module.css";
import { Button, Container, Grid } from "@mui/material";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <div style={{ textAlign: "center", paddingTop: 32, paddingBottom: 8 }}>
        <img src={"tc_logo.png"} width={"200px"} />
        <h3>ระบบจัดการบัญชี</h3>
      </div>

      <Container maxWidth="md">
        <Grid container spacing={6}>
          <Grid item xs={6} md={4}>
            <div
              className="button-custom"
              style={{ width: "100%" }}
              onClick={() => router.push("/add-income")}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <img src={"income.png"} width="50%" />
                <h3>รับเงินเข้า</h3>
              </div>
            </div>
          </Grid>
          <Grid item xs={6} md={4}>
            <div
              className="button-custom"
              style={{ width: "100%" }}
              onClick={() => router.push("/add-expense")}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <img src={"expense.png"} width="50%" />
                <h3>เบิกเงินออก</h3>
              </div>
            </div>
          </Grid>
          <Grid item xs={6} md={4}>
            <div
              className="button-custom"
              style={{ width: "100%" }}
              onClick={() => router.push("/history")}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <img src={"history.png"} width="50%" />
                <h3>ประวัติเงินเข้า-ออก</h3>
              </div>
            </div>
          </Grid>

          <Grid item xs={6} md={4}>
            <div
              className="button-custom"
              style={{ width: "100%" }}
              onClick={() => router.push("/showmoney")}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <img src={"money.png"} width="50%" />
                <h3>ยอดปันผล</h3>
              </div>
            </div>
          </Grid>
          <Grid item xs={6} md={4}>
            <div
              className="button-custom"
              style={{ width: "100%" }}
              onClick={() => router.push("/report")}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <img src={"report.png"} width="50%" />
                <h3>สรุปยอด</h3>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
