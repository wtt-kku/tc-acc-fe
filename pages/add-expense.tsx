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

const payment = [
  "ค่าบ้าน",
  "ค่าซื้อของ/ลงทุน",
  "ค่าของใช้ในบ้าน",
  "ค่าลูกน้อง",
  "ค่าไฟ/ค่าน้ำ/ค่าโทรศัพท์/ค่าเน็ต",
  "จ่ายหนี้",
  "อื่นๆ",
];

const users = ["มาย", "เต้ย", "ต่อ", "พ่อ", "แม่"];

const AddExpense = (props: Props) => {
  const router = useRouter();
  const [payType, setPayType] = React.useState<string>("");

  const [receiverName, setReceiverName] = React.useState<string>("");
  const [receiverBank, setReceiverBank] = React.useState<string>("");

  const [amount, setAmount] = React.useState<number>(0);

  const [remark, setRemark] = React.useState<string>("");

  const [reporter, setReporter] = React.useState<string>("");

  const onAmountChange = (e: any) => {
    if (isNaN(e.target.value)) {
      console.log("Not number !");
    } else {
      setAmount(e.target.value);
    }
  };

  const onFinish = async () => {
    let data = {
      type: payType,
      receiver_name: receiverName,
      receiver_bank: receiverBank,
      amount: parseFloat(amount.toString()),
      remark: remark,
      reporter: reporter,
    };

    if (
      receiverName != "" ||
      receiverBank != "" ||
      payType != "" ||
      amount != 0 ||
      reporter != ""
    ) {
      try {
        let url = process.env.NEXT_PUBLIC_API_HOST + "/api/add-expense";
        let body = data;
        let result = await axios.post(url, body);
        console.log(result);
        if (result.data.result) {
          Swal.fire({
            title: "OK!",
            text: "ส่งการเบิกสำเร็จ",
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
          กรอกข้อมูลการ <b style={{ color: "#CD0404" }}>เบิกเงินออก</b>
        </h2>

        <Box style={{ display: "flex", flexDirection: "column" }}>
          <FormControl fullWidth margin="dense">
            <InputLabel id="demo-simple-select-label">
              ประเภทค่าใช้จ่าย
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={payType}
              label="ชื่อผู้โอนเงินเข้า"
              onChange={(e) => setPayType(e.target.value)}
            >
              {payment.map((name, i) => (
                <MenuItem key={i} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <TextField
              fullWidth
              id="outlined-basic"
              label="ชื่อผู้รับเงิน"
              variant="outlined"
              onChange={(e) => setReceiverName(e.target.value)}
              value={receiverName}
            />
          </FormControl>

          <FormControl fullWidth margin="dense">
            <TextField
              fullWidth
              id="outlined-basic"
              label="หมายเลข และ ธนาคารของผู้รับเงิน"
              variant="outlined"
              onChange={(e) => setReceiverBank(e.target.value)}
              value={receiverBank}
            />
          </FormControl>

          <FormControl margin="dense">
            <InputLabel htmlFor="outlined-adornment-amount">
              จำนวนเงินที่เบิกออก
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={
                <InputAdornment position="start">฿</InputAdornment>
              }
              label="จำนวนเงินที่เบิกออก"
              onChange={onAmountChange}
              value={amount}
            />
          </FormControl>

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

export default AddExpense;
