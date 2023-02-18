import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import axios from "axios";
import Swal from "sweetalert2";
import delay from "@/utils/delay";
import { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type Props = {};

const VerifyExpense = (props: Props) => {
  const router = useRouter();

  const [expenseID, setExpenseID] = React.useState<string>("");
  const [transactionDate, setTransactionDate] = React.useState<Dayjs | null>(
    null
  );
  const [time, setTime] = React.useState<string>("00.00");

  const onTimeChange = (e: any) => {
    if (isNaN(e.target.value)) {
      console.log("Not number !");
    } else {
      setTime(e.target.value);
    }
  };

  const onFinish = async () => {
    let data = {
      id: expenseID,
      transaction_date: transactionDate?.toISOString() || null,
      time: time,
    };

    if (expenseID != "" || transactionDate != null || time != "") {
      try {
        let url = process.env.NEXT_PUBLIC_API_HOST + "/api/verify-expense";
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
                value={expenseID}
                onChange={(e) => setExpenseID(e.target.value)}
              />
            </div>
            <div style={{ paddingTop: 8 }} />
          </Grid>
          <Grid item xs={12}>
            <Box style={{ display: "flex", flexDirection: "row" }}>
              <div>
                <FormControl
                  margin="dense"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="วันที่โอน"
                      inputFormat="DD/MM/YYYY"
                      value={transactionDate}
                      onChange={(e) => {
                        console.log(e);
                        console.log(e?.toDate().toISOString());
                        setTransactionDate(e);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div>
                <FormControl margin="dense">
                  <InputLabel htmlFor="outlined-adornment-amount">
                    เวลาที่โอน
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    endAdornment={
                      <InputAdornment position="start">น.</InputAdornment>
                    }
                    label="เวลาที่โอน"
                    value={time}
                    onChange={onTimeChange}
                  />
                </FormControl>
              </div>
            </Box>
          </Grid>

          <Grid item xs={12}>
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

export default VerifyExpense;
