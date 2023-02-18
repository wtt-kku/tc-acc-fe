import Head from "next/head";
import Image from "next/image";

import styles from "@/styles/Home.module.css";
import { Button, Container, Grid } from "@mui/material";
import { useRouter } from "next/router";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <div style={{ textAlign: "center", paddingTop: 32, paddingBottom: 8 }} />

      <Container maxWidth="md">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div
              className="button-custom"
              style={{ width: "100%" }}
              onClick={() => router.push("/back/verify-income")}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <PaidRoundedIcon color="success" />
                <div style={{ padding: 4 }} />
                <h3>ยืนยันรับเงิน</h3>
              </div>
            </div>
          </Grid>

          <Grid item xs={12}>
            <div
              className="button-custom"
              style={{ width: "100%" }}
              onClick={() => router.push("/back/verify-expense")}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <PaidRoundedIcon />
                <div style={{ padding: 4 }} />

                <h3>ยืนยันเงินเบิก</h3>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
