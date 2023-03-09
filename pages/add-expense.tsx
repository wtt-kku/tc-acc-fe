import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
  Typography,
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
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import toShowCurrency from "@/utils/currency";

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

  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [payType, setPayType] = React.useState<string>("");

  const [draftReceiverName, setDraftReceiverName] = React.useState<string>("");
  const [draftReceiverBank, setDraftReceiverBank] = React.useState<string>("");
  const [draftReceiverBankNo, setDraftReceiverBankNo] =
    React.useState<string>("");

  const [receiverName, setReceiverName] = React.useState<string>("");
  const [receiverBank, setReceiverBank] = React.useState<string>("");
  const [receiverBankNo, setReceiverBankNo] = React.useState<string>("");

  const [amount, setAmount] = React.useState<number>(0);

  const [remark, setRemark] = React.useState<string>("");

  const [reporter, setReporter] = React.useState<string>("");

  const [summary, setSummary] = React.useState<number>(0);
  const [summaryExcludeVat, setSummaryExcludeVat] = React.useState<number>(0);

  const [budgetTotal, setBudgetTotal] = React.useState<number>(1000);
  const [budget, setBudget] = React.useState<number>(0);
  const [expenseSum, setExpenseSum] = React.useState<number>(0);

  const [isReady, setIsReady] = React.useState<boolean>(false);

  React.useEffect(() => {
    setSummaryExcludeVat(summary - (summary / 100) * 7);
  }, [summary]);

  React.useEffect(() => {
    setBudget((summaryExcludeVat / 100) * 70);
  }, [summaryExcludeVat]);

  React.useEffect(() => {
    setBudgetTotal(budget - expenseSum);
    setIsReady(true);
  }, [expenseSum, budget]);

  const onAmountChange = (e: any) => {
    if (isNaN(e.target.value)) {
    } else {
      setAmount(e.target.value);
    }
  };

  const setGroups = (rName: string, rBank: string, rBankNo: string) => {
    if (rName != "" || rBank != "" || rBankNo != "") {
      setReceiverName(rName);
      setReceiverBank(rBank);
      setReceiverBankNo(rBankNo);

      setOpenModal(false);
    }
  };

  const loadIncomes = async () => {
    try {
      let url = process.env.NEXT_PUBLIC_API_HOST + "/api/incomes";
      let body = {
        date: new Date().toISOString(),
      };
      let result = await axios.post(url, body);
      if (result.data.result) {
        setSummary(result.data.data.success_summary);
      } else {
        Swal.fire({
          title: "Error!",
          text: "โหลดรายการเงินเข้าไม่ได้",
          icon: "error",
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "โหลดรายการเงินเข้าไม่ได้",
        icon: "error",
        showConfirmButton: false,
      });
    }
  };

  const loadExpenses = async () => {
    try {
      let url = process.env.NEXT_PUBLIC_API_HOST + "/api/expenses-td";
      let body = {
        date: new Date().toISOString(),
      };
      let result = await axios.post(url, body);
      if (result.data.result) {
        setExpenseSum(result.data.data.success_summary);
      } else {
        Swal.fire({
          title: "Error!",
          text: "โหลดรายการเบิกไม่ได้",
          icon: "error",
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "โหลดรายการเบิกไม่ได้",
        icon: "error",
        showConfirmButton: false,
      });
    }
  };

  React.useEffect(() => {
    loadIncomes();
    loadExpenses();
  }, []);

  const onFinish = async () => {
    let data = {
      type: payType,
      receiver_name: receiverName,
      receiver_bank: receiverBank,
      receiver_bank_no: receiverBankNo,
      amount: parseFloat(amount.toString()),
      remark: remark,
      reporter: reporter,
    };

    if (
      receiverName != "" ||
      receiverBank != "" ||
      receiverBankNo != "" ||
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
        <Box style={{ paddingTop: 16 }}>
          <Button
            variant="outlined"
            onClick={() => router.push("/")}
            startIcon={<ArrowBackIosIcon />}
          >
            กลับหน้าหลัก
          </Button>
        </Box>
        <br />

        <h2>
          กรอกข้อมูลการ <b style={{ color: "#CD0404" }}>เบิกเงินออก</b>
        </h2>

        <Grid container>
          <Grid item xs={12} md={8} className="frame-budget">
            <Typography
              component="h2"
              variant="h6"
              style={{ color: "rgb(11 97 6)" }}
              gutterBottom
            >
              ยอดที่สามารถเบิกได้
            </Typography>
            <Typography component="p" variant="h4">
              ฿ {toShowCurrency(budgetTotal)}
            </Typography>
          </Grid>
        </Grid>

        <div style={{ paddingTop: 16 }} />

        {isReady ? (
          <>
            {" "}
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
                <Button
                  onClick={() => setOpenModal(true)}
                  variant="contained"
                  style={{ padding: 12 }}
                  // onChange={(e) => setReceiverName(e.target.value)}
                >
                  เลือกผู้รับเงิน
                </Button>
              </FormControl>

              <FormControl fullWidth margin="dense">
                <TextField
                  disabled
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  id="outlined-basic"
                  label="ชื่อผู้รับเงิน"
                  // onClick={() => setOpenModal(true)}
                  variant="filled"
                  // onChange={(e) => setReceiverName(e.target.value)}
                  value={receiverName}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <TextField
                  disabled
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  // onClick={() => setOpenModal(true)}
                  id="outlined-basic"
                  label="ธนาคารของผู้รับเงิน"
                  variant="filled"
                  // onChange={(e) => setReceiverBank(e.target.value)}
                  placeholder="KBANK / SCB / พร้อมเพย์"
                  value={receiverBank}
                />
              </FormControl>

              <FormControl fullWidth margin="dense">
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  disabled
                  // onClick={() => setOpenModal(true)}
                  id="outlined-basic"
                  label="หมายเลขบัญชี / หมายเลยพร้อมเพย์"
                  variant="filled"
                  // onChange={(e) => setReceiverBankNo(e.target.value)}
                  placeholder="0123456789"
                  value={receiverBankNo}
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
                <InputLabel id="demo-simple-select-label">
                  คนทำรายการ
                </InputLabel>
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
          </>
        ) : (
          <div style={{ width: "100%", textAlign: "center", paddingTop: 32 }}>
            <CircularProgress />
            <p>รอโหลดยอดเบิก</p>
          </div>
        )}
      </Container>

      <Dialog
        disableEscapeKeyDown
        fullWidth
        open={openModal}
        // onClose={() => setremarkDialog("")}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">เลือกบัญชีธนาคาร</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              <ListItemButton
                onClick={() =>
                  setGroups("นายพัฒนาการ วงษาบุตร", "KBANK", "7522104366")
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <img src="icon-kbank.png" width={"100%"} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="7522104366"
                  secondary="นายพัฒนาการ วงษาบุตร"
                />
              </ListItemButton>
              <Divider />
              <ListItemButton
                onClick={() =>
                  setGroups("นส.จุฬารัตน์ ป้องเทพ", "SCB", "0472624090")
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <img src="icon-scb.png" width={"100%"} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="0472624090"
                  secondary="นส.จุฬารัตน์ ป้องเทพ"
                />
              </ListItemButton>
              <Divider />
              <ListItemButton
                onClick={() =>
                  setGroups("นส.จุฬารัตน์ ป้องเทพ", "KBANK", "0378171202")
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <img src="icon-kbank.png" width={"100%"} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="0378171202"
                  secondary="นส.จุฬารัตน์ ป้องเทพ"
                />
              </ListItemButton>
              <Divider />
              <ListItemButton
                onClick={() =>
                  setGroups("นส.ภาวนา มหาชัย", "BBL", "0240149781")
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <img src="icon-bkb.png" width={"100%"} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="0240149781"
                  secondary="นส.ภาวนา มหาชัย"
                />
              </ListItemButton>
              <Divider />
              <h3>หรือใส่ข้อมูลเอง </h3>
              <FormControl fullWidth margin="dense">
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="ชื่อผู้รับเงิน"
                  variant="outlined"
                  onChange={(e) => setDraftReceiverName(e.target.value)}
                  value={draftReceiverName}
                />
              </FormControl>
              <FormControl fullWidth margin="dense">
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="ธนาคารของผู้รับเงิน"
                  variant="outlined"
                  onChange={(e) => setDraftReceiverBank(e.target.value)}
                  placeholder="KBANK / SCB / พร้อมเพย์"
                  value={draftReceiverBank}
                />
              </FormControl>
              <FormControl fullWidth margin="dense">
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="หมายเลขบัญชี / หมายเลยพร้อมเพย์"
                  variant="outlined"
                  onChange={(e) => setDraftReceiverBankNo(e.target.value)}
                  placeholder="0123456789"
                  value={draftReceiverBankNo}
                />
              </FormControl>
              <div style={{ paddingTop: 8 }} />
              <Button
                variant="contained"
                color="success"
                style={{ padding: 16 }}
                fullWidth
                onClick={() =>
                  setGroups(
                    draftReceiverName,
                    draftReceiverBank,
                    draftReceiverBankNo
                  )
                }
              >
                ยืนยันข้อมูลผู้รับ
              </Button>
            </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} autoFocus>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddExpense;
