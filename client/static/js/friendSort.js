// this is a suggested way to make the client side friend's list into a hash table.

// a user should contain: {id: 3985204523, fStatus: [0-3]}
// key to hash table: 0 = others, 1 = pending, 2 = requested, 3 = friends

function fSort(user) {
  if (user.fStatus == 1 || user.fStatus == 2) {
    var other = people[0];
    var ask   = people[user.fStatus];
  } else {
    var other = people[user.fStatus];
    var ask   = people[3];
  }
  if (ask) {
    while (ask.next) {
      ask = ask.next)
    }
  }
  if (other.user == user.id) {
    if (ask)
      ask.next = other;
    else
      people[user.fStatus] = other;
    if (other.fStatus != 3)
      people[0] = other.next;
    else
      people[user.fStatus] = other.next;
    other.next = null;
  } else {
    while (other.next) {
      if (other.next.user == user.id)
        other = other.next;
    }
    if (ask)
      ask.next = other.next;
    else
      people[user.fStatus] = other.next;
    var temp = other.next;
    other.next = other.next.next
    temp.next = null;
    }
  }
}
