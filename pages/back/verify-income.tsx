import { Box, Button, Container, Grid, TextField } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import axios from "axios";
import Swal from "sweetalert2";
import delay from "@/utils/delay";

type Props = {};

const VerifyIncome = (props: Props) => {
  const router = useRouter();

  const [incomeID, setIncomeID] = React.useState<string>("");

  const onFinish = async () => {
    let data = {
      id: incomeID,
    };

    if (incomeID != "") {
      try {
        let url = process.env.NEXT_PUBLIC_API_HOST + "/api/verify-income";
        let body = data;
        let result = await axios.post(url, body);
        console.log(result);
        if (result.data.result) {
          Swal.fire({
            title: "OK!",
            text: "ยืนยันสำเร็จ",
            icon: "success",
            showConfirmButton: false,
          });

          await delay(400);

          router.push("/back");
        } else {
          Swal.fire({
            title: "Error!",
            text: "เกิดข้อผิดพลาด",
            icon: "error",
            showConfirmButton: false,
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "เกิดข้อผิดพลาด",
          icon: "error",
          showConfirmButton: false,
        });
      }
    } else {
      Swal.fire({
        title: "Error!",
        text: "กรอกข้อมูลไม่ครบ",
        icon: "error",
        showConfirmButton: false,
      });
    }
  };

  return (
    <>
      <Container maxWidth="md">
        <Box style={{ paddingTop: 16 }}>
          <Button
            variant="outlined"
            onClick={() => router.push("/back")}
            startIcon={<ArrowBackIosIcon />}
          >
            กลับหน้าหลัก
          </Button>
        </Box>
        <br />

        <div style={{ paddingTop: 32 }} />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div style={{ width: "100%" }}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Income ID"
                variant="outlined"
                value={incomeID}
                onChange={(e) => setIncomeID(e.target.value)}
              />
            </div>
            <div style={{ paddingTop: 8 }} />
            <Button
              variant="contained"
              onClick={onFinish}
              disableElevation
              fullWidth
            >
              ยืนยัน
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default VerifyIncome;
