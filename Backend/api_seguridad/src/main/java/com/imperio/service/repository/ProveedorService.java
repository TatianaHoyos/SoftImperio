package com.imperio.service.repository;

import com.imperio.service.model.entity.ProveedoresEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProveedorService {
    @Autowired
    private ProveedorRepository ProveedorRepository;

    public ProveedoresEntity crearProveedor(ProveedoresEntity proveedor){
        return  ProveedorRepository.save(proveedor);

    }


    public Optional<ProveedoresEntity> obtenerProveedor(Integer id){
        return ProveedorRepository.findById(id);
    }

    public List<ProveedoresEntity> obtenerProveedores(){
        return ProveedorRepository.findAll();
    }
    public void eliminarProveedores(int idProveedores){
        ProveedorRepository.deleteById(idProveedores);
    }
}
