import {
  Box,
  Button,
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import axios from "axios";
import delay from "@/utils/delay";

type Props = {};

const methods = ["บัญชีธนาคาร , QR Code", "เงินสด"];

const users = ["มาย", "เต้ย", "ต่อ", "พ่อ", "แม่"];

const AddIncome = (props: Props) => {
  const router = useRouter();
  const [paymethod, setPayMethod] = React.useState<string>("");

  const [tranferorName, setTranferorName] = React.useState<string>("");
  const [tranferorBank, setTranferorBank] = React.useState<string>("");

  const [amount, setAmount] = React.useState<number>(0);
  const [transactionDate, setTransactionDate] = React.useState<Dayjs | null>(
    null
  );
  const [time, setTime] = React.useState<string>("00.00");
  const [remark, setRemark] = React.useState<string>("");

  const [reporter, setReporter] = React.useState<string>("");

  const onAmountChange = (e: any) => {
    if (isNaN(e.target.value)) {
      console.log("Not number !");
    } else {
      setAmount(e.target.value);
    }
  };

  const onTimeChange = (e: any) => {
    if (isNaN(e.target.value)) {
      console.log("Not number !");
    } else {
      setTime(e.target.value);
    }
  };

  const onFinish = async () => {
    let data = {
      transferor_name: tranferorName,
      transferor_bank: tranferorBank,
      method: paymethod,
      amount: parseFloat(amount.toString()),
      transaction_date: dayjs(transactionDate).format(),
      time: time,
      remark: remark,
      reporter: reporter,
    };

    if (
      tranferorName != "" ||
      tranferorBank != "" ||
      paymethod != "" ||
      dayjs(transactionDate).format() != "Invalid Date" ||
      amount != 0 ||
      reporter != ""
    ) {
      try {
        let url = process.env.NEXT_PUBLIC_API_HOST + "/api/add-income";
        let body = data;
        let result = await axios.post(url, body);
        console.log(result);
        if (result.data.result) {
          Swal.fire({
            title: "OK!",
            text: "บันทึกรายการสำเร็จ",
            icon: "success",
            showConfirmButton: false,
          });

          await delay(400);

          router.push("/");
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
      <Container maxWidth="sm" style={{ padding: 32 }}>
        <Box style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
          <ArrowBackIosNewIcon fontSize="small" /> กลับหน้าหลัก
        </Box>
        <br />

        <h2>
          กรอกข้อมูลการ <b style={{ color: "green" }}>รับเงินเข้า</b>
        </h2>

        <Box style={{ display: "flex", flexDirection: "column" }}>
          <FormControl fullWidth margin="dense">
            <TextField
              fullWidth
              id="outlined-basic"
              label="ชื่อผู้โอนเงินเข้า หรือ ชื่อลูกค้า"
              variant="outlined"
              onChange={(e) => setTranferorName(e.target.value)}
              value={tranferorName}
            />
          </FormControl>

          <FormControl fullWidth margin="dense">
            <TextField
              fullWidth
              id="outlined-basic"
              label="โอนมาจากธนาคาร"
              variant="outlined"
              onChange={(e) => setTranferorBank(e.target.value)}
              value={tranferorBank}
            />
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel id="demo-simple-select-label">
              ช่องทางรับเงิน
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={paymethod}
              label="ชื่อผู้โอนเงินเข้า"
              onChange={(e) => setPayMethod(e.target.value)}
            >
              {methods.map((name, i) => (
                <MenuItem key={i} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl margin="dense">
            <InputLabel htmlFor="outlined-adornment-amount">
              จำนวนเงินที่รับ
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={
                <InputAdornment position="start">฿</InputAdornment>
              }
              label="จำนวนเงินที่รับ"
              onChange={onAmountChange}
              value={amount}
            />
          </FormControl>

          <Box style={{ display: "flex", flexDirection: "row" }}>
            <div>
              <FormControl
                margin="dense"
                style={{ display: "flex", flexDirection: "row" }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="วันที่โอน"
                    value={transactionDate}
                    onChange={(e) => {
                      console.log(e);
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

          <FormControl margin="dense">
            <TextField
              id="outlined-multiline-static"
              label="หมายเหตุอื่นๆ"
              multiline
              rows={4}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel id="demo-simple-select-label">คนทำรายการ</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={reporter}
              label="คนทำรายการ"
              onChange={(e) => setReporter(e.target.value)}
            >
              {users.map((name, i) => (
                <MenuItem key={i} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <br />

          <Button
            variant="contained"
            disableElevation
            style={{ padding: 16 }}
            onClick={onFinish}
          >
            ยืนยัน
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default AddIncome;
