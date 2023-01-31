import Head from "next/head";
import Image from "next/image";

import styles from "@/styles/Home.module.css";
import { Button, Container, Grid } from "@mui/material";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Container
        maxWidth="md"
        style={{
          // background: "green",
          height: "100vh",
          display: "flex",
          alignContent: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Grid container spacing={6}>
          <div style={{ width: "100%", textAlign: "center" }}>
            <h2>ระบบจัดการบัญชีร้านไทยเจริญ โฆษณา</h2>
          </div>
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} md={4}>
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
                <h3>ตรวจประวัติ</h3>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
