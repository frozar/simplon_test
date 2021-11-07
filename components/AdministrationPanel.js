import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
  p: 2,
};

export default function AdministrationPanel(props) {
  const { openModal, handleClose } = props;

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styleModal}>
        <Grid container justifyContent="center">
          <Grid item>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Panneau d&apos;administration
            </Typography>
          </Grid>
          <Grid
            container
            item
            justifyContent="space-evenly"
            style={{ marginTop: "15px" }}
          >
            <Grid item>
              <Button variant="contained" onClick={() => alert("utilisateur")}>
                <Typography id="admin-utilisateur-button" variant="button">
                  Gérer les utilisateurs
                </Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={() => alert("machine")}>
                <Typography id="admin-machine-button" variant="button">
                  Gérer les machines
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
