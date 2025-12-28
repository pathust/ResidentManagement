package com.soict.repository.fee;

import com.soict.entity.fee.CollectionEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CollectionEventRepository extends JpaRepository<CollectionEvent, Integer>, JpaSpecificationExecutor<CollectionEvent> {
}
