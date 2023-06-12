import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;

public class PermisoService implements ActionListener {

  private static final String DB_URL = "jdbc:mysql://localhost:3306/soft_imperio";
  private static final String DB_USERNAME = "root";
  private static final String DB_PASSWORD = "Sena1234";
  
  private JFrame frame;
  private JPanel panel;
  private JTextField searchInput;
  private JButton searchButton;
  
  public PermisoService() {
    frame = new JFrame("Interfaz de Permisos");
    panel = new JPanel();
    searchInput = new JTextField(20);
    searchButton = new JButton("Buscar");
    
    searchButton.addActionListener(this);
    
    panel.add(searchInput);
    panel.add(searchButton);
    
    frame.add(panel);
    frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    frame.pack();
    frame.setVisible(true);
  }

  @Override
  public void actionPerformed(ActionEvent e) {
    if (e.getSource() == searchButton) {
      String searchTerm = searchInput.getText();
      
      // Obtener el ID de usuario desde la base de datos usando el término de búsqueda
      int IdUsuarios = obtenerIdUsuarioDesdeBD(searchTerm);
      
      if (IdUsuarios != -1) {
        // Realizar las operaciones de asignación, revocación u obtención de permisos aquí
        // utilizando el ID de usuario obtenido
        // Ejemplo:
        asignarPermiso(IdUsuarios, 1);
        revocarPermiso(IdUsuarios, 2);
        obtenerPermisosUsuario(IdUsuarios);
      } else {
        JOptionPane.showMessageDialog(null, "No se encontró ningún usuario con el término de búsqueda proporcionado.");
      }
    }
  }

  public int obtenerIdUsuarioDesdeBD(String searchTerm) {
    int IdUsuarios = -1;
    
    try (Connection conn = DriverManager.getConnection(DB_URL, DB_USERNAME, DB_PASSWORD)) {
      String query = "SELECT id FROM usuarios WHERE nombre LIKE ?";
      try (PreparedStatement stmt = conn.prepareStatement(query)) {
        stmt.setString(1, "%" + searchTerm + "%");
        ResultSet rs = stmt.executeQuery();

        if (rs.next()) {
          idUsuario = rs.getInt("id");
        }
      }

    } catch (SQLException ex) {
      JOptionPane.showMessageDialog(null, "Error al obtener el ID de usuario desde la base de datos: " + ex.getMessage());
    }
    
    return idUsuario;
  }
  
  public void asignarPermiso(int idUsuario, int idPermiso) {
    try (Connection conn = DriverManager.getConnection(DB_URL, DB_USERNAME, DB_PASSWORD)) {
      // Resto del código para asignar el permiso al usuario
      // ...
    } catch (SQLException ex) {
      JOptionPane.showMessageDialog(null, "Error al asignar el permiso al usuario: " + ex.getMessage());
    }
  }

  public void revocarPermiso(int idUsuario, int idPermiso) {
    try (Connection conn = DriverManager.getConnection(DB_URL, DB_USERNAME, DB_PASSWORD)) {
      // Resto del código para revocar el permiso al usuario
      // ...
    } catch (SQLException ex) {
      JOptionPane.showMessageDialog(null, "Error al revocar el permiso al usuario: " + ex.getMessage());
    }
  }

  public void obtenerPermisosUsuario(int idUsuario) {
    try (Connection conn = DriverManager.getConnection(DB_URL, DB_USERNAME, DB_PASSWORD)) {
      // Resto del código para obtener los permisos del usuario
      // ...
    } catch (SQLException ex) {
      JOptionPane.showMessageDialog(null, "Error al obtener los permisos del usuario: " + ex.getMessage());
    }
  }

  public static void main(String[] args) {
    PermisoService permisoService = new PermisoService();
  }
}
